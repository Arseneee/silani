<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    protected $baseUrl;
    protected $account_token;

    // Konstanta endpoint API Fonnte
    const ENDPOINTS = [
        'send_message'  => 'https://api.fonnte.com/send',
        'add_device'    => 'https://api.fonnte.com/add-device',
        'qr_activation' => 'https://api.fonnte.com/qr',
        'get_devices'   => 'https://api.fonnte.com/get-devices',
        'device_profile' => 'https://api.fonnte.com/device',
        'delete_device' => 'https://api.fonnte.com/delete-device',
        'disconnect'    => 'https://api.fonnte.com/disconnect',

    ];

    public function __construct()
    {
        $this->baseUrl = 'https://api.fonnte.com';
        $this->account_token = config('services.fonnte.account_token');

        if (!$this->account_token) {
            throw new Exception('Fonnte token not configured');
        }
    }

    protected function makeRequest($endpoint, $params = [], $useAccountToken = true, $deviceToken = null)
    {
        $token = $useAccountToken
            ? $this->account_token
            : ($deviceToken ?? null);

        if (!$token) {
            return ['status' => false, 'error' => 'API token or device token is required.'];
        }

        $response = Http::withHeaders([
            'Authorization' => $token,
            'Content-Type'  => 'application/json',
        ])->post($endpoint, $params);

        Log::info('Fonnte API Response', ['endpoint' => $endpoint, 'response' => $response->json()]);

        if ($response->failed()) {
            return [
                'status' => false,
                'error'  => $response->json()['reason'] ?? 'Unknown error occurred',
            ];
        }

        return [
            'status' => true,
            'data'   => $response->json(),
        ];
    }

    public function getDevices(): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->account_token
            ])->post($this->baseUrl . '/get-devices');

            $data = $response->json();

            if ($response->successful() && isset($data['status']) && $data['status']) {
                return [
                    'status' => true,
                    'data' => $data['data'] ?? []
                ];
            }

            return [
                'status' => false,
                'error' => $data['reason'] ?? 'Failed to fetch devices'
            ];
        } catch (Exception $e) {
            Log::error('Fonnte getDevices error: ' . $e->getMessage());
            return [
                'status' => false,
                'error' => 'API connection failed'
            ];
        }
    }

    public function connectDevice(string $deviceToken): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->account_token
            ])->asForm()->post($this->baseUrl . '/qr', [
                'token' => $deviceToken
            ]);

            Log::info('Raw response', ['body' => $response->body()]);

            $data = $response->json();

            if ($response->successful() && isset($data['status']) && $data['status']) {
                return [
                    'status' => true,
                    'data' => [
                        'url' => $data['url'] ?? null,
                        'qr' => $data['qr'] ?? null
                    ]
                ];
            }

            return [
                'status' => false,
                'error' => $data['reason'] ?? 'Failed to connect device'
            ];
        } catch (Exception $e) {
            Log::error('Fonnte connectDevice error: ' . $e->getMessage());
            return [
                'status' => false,
                'error' => 'API connection failed'
            ];
        }
    }

    public function disconnectDevice(string $deviceToken): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->account_token
            ])->post($this->baseUrl . '/disconnect', [
                'token' => $deviceToken
            ]);

            $data = $response->json();

            if ($response->successful() && isset($data['status']) && $data['status']) {
                return [
                    'status' => true,
                    'message' => 'Device disconnected successfully'
                ];
            }

            return [
                'status' => false,
                'error' => $data['reason'] ?? 'Failed to disconnect device'
            ];
        } catch (Exception $e) {
            Log::error('Fonnte disconnectDevice error: ' . $e->getMessage());
            return [
                'status' => false,
                'error' => 'API connection failed'
            ];
        }
    }

    public function getDeviceProfile(string $deviceToken): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->account_token
            ])->post($this->baseUrl . '/fetch-profile', [
                'token' => $deviceToken
            ]);

            $data = $response->json();

            if ($response->successful() && isset($data['status']) && $data['status']) {
                return [
                    'status' => true,
                    'data' => $data
                ];
            }

            return [
                'status' => false,
                'error' => $data['reason'] ?? 'Failed to get device profile'
            ];
        } catch (Exception $e) {
            Log::error('Fonnte getDeviceProfile error: ' . $e->getMessage());
            return [
                'status' => false,
                'error' => 'API connection failed'
            ];
        }
    }

    public function getDeviceStatus(string $deviceToken): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->account_token
            ])->post($this->baseUrl . '/status', [
                'token' => $deviceToken
            ]);

            $data = $response->json();

            if ($response->successful() && isset($data['status']) && $data['status']) {
                return [
                    'status' => true,
                    'data' => $data
                ];
            }

            return [
                'status' => false,
                'error' => $data['reason'] ?? 'Failed to get device status'
            ];
        } catch (Exception $e) {
            Log::error('Fonnte getDeviceStatus error: ' . $e->getMessage());
            return [
                'status' => false,
                'error' => 'API connection failed'
            ];
        }
    }

    public function getAccountInfo(): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->account_token
            ])->post($this->baseUrl . '/validate');

            $data = $response->json();

            if ($response->successful() && isset($data['status']) && $data['status']) {
                return [
                    'status' => true,
                    'data' => $data
                ];
            }

            return [
                'status' => false,
                'error' => $data['reason'] ?? 'Failed to get account info'
            ];
        } catch (Exception $e) {
            Log::error('Fonnte getAccountInfo error: ' . $e->getMessage());
            return [
                'status' => false,
                'error' => 'API connection failed'
            ];
        }
    }

    public function requestQRActivation(string $phoneNumber, string $deviceToken): array
    {
        return $this->connectDevice($deviceToken);
    }

    public static function sendMessage($to, $message)
    {
        $response = Http::withHeaders([
            'Authorization' => config('services.fonnte.token')
        ])->asForm()->post('https://api.fonnte.com/send', [
            'target' => $to,
            'message' => $message,
            'countryCode' => '62',
        ]);

        return $response->json();
    }

    public static function normalizePhone($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);

    if (preg_match('/^0/', $phone)) {
        $phone = '62' . substr($phone, 1);
    }

    $phone = ltrim($phone, '+');
    $phone = preg_replace('/^00/', '', $phone);
    
    return $phone;
}
}
