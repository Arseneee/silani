<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Services\FonnteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Exception;

class DeviceController extends Controller
{
    protected $fonnteService;

    public function __construct(FonnteService $fonnteService)
    {
        $this->fonnteService = $fonnteService;
    }

    public function index(): View|JsonResponse
    {
        try {
            $response = $this->fonnteService->getDevices();

            if ($response['status']) {
                $devices = $response['data'] ?? [];

                if (request()->wantsJson()) {
                    return response()->json([
                        'status' => true,
                        'devices' => $devices
                    ]);
                }

                $page_title = 'All Devices';
                return view('dashboard', compact('devices', 'page_title'));
            }

            if (request()->wantsJson()) {
                return response()->json([
                    'status' => false,
                    'error' => $response['error'] ?? 'Failed to fetch devices',
                    'devices' => []
                ], 500);
            }

            return view('devices.index', [
                'devices' => [],
                'page_title' => 'All Devices',
                'error' => $response['error'] ?? 'Failed to fetch devices'
            ]);
        } catch (Exception $e) {
            Log::error('Error fetching devices: ' . $e->getMessage());

            if (request()->wantsJson()) {
                return response()->json([
                    'status' => false,
                    'error' => 'Internal server error',
                    'devices' => []
                ], 500);
            }

            return view('devices.index', [
                'devices' => [],
                'page_title' => 'All Devices',
                'error' => 'Internal server error'
            ]);
        }
    }

    public function activateDevice(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'device' => 'required|string',
                'token' => 'required|string'
            ]);

            $phoneNumber = $request->input('device');
            $deviceToken = $request->input('token');

            Log::info('Activating device', [
                'phone' => $phoneNumber,
                'token' => substr($deviceToken, 0, 10) . '...'
            ]);

            $response = $this->fonnteService->connectDevice($deviceToken);

            if ($response['status']) {
                Log::info('Device activation successful', ['phone' => $phoneNumber]);

                return response()->json([
                    'status' => true,
                    'message' => 'Device activation initiated successfully',
                    'url' => $response['data']['url'] ?? null,
                    'qr' => $response['data']['qr'] ?? null
                ]);
            }

            Log::warning('Device activation failed', [
                'phone' => $phoneNumber,
                'error' => $response['error'] ?? 'Unknown error'
            ]);

            return response()->json([
                'status' => false,
                'error' => $response['error'] ?? 'Failed to activate the device.'
            ], 400);
        } catch (Exception $e) {
            Log::error('Device activation error: ' . $e->getMessage(), [
                'phone' => $request->input('device'),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => false,
                'error' => 'Internal server error'
            ], 500);
        }
    }

    public function show($token): JsonResponse
    {
        try {
            $response = $this->fonnteService->getDeviceProfile($token);

            if ($response['status']) {
                return response()->json([
                    'status' => true,
                    'data' => $response['data']
                ]);
            }

            return response()->json([
                'status' => false,
                'error' => $response['error'] ?? 'Failed to get device profile'
            ], 400);
        } catch (Exception $e) {
            Log::error('Error getting device profile: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'error' => 'Internal server error'
            ], 500);
        }
    }

    public function disconnect(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'token' => 'required|string'
            ]);

            $deviceToken = $request->input('token');

            Log::info('Disconnecting device', [
                'token' => substr($deviceToken, 0, 10) . '...'
            ]);

            $response = $this->fonnteService->disconnectDevice($deviceToken);

            if ($response['status']) {
                Log::info('Device disconnected successfully');

                return response()->json([
                    'status' => true,
                    'message' => 'Device disconnected successfully'
                ]);
            }

            Log::warning('Device disconnection failed', [
                'error' => $response['error'] ?? 'Unknown error'
            ]);

            return response()->json([
                'status' => false,
                'error' => $response['error'] ?? 'Failed to disconnect device'
            ], 400);
        } catch (Exception $e) {
            Log::error('Device disconnection error: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'error' => 'Internal server error'
            ], 500);
        }
    }

    public function checkStatus(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'token' => 'required|string'
            ]);

            $deviceToken = $request->input('token');
            $response = $this->fonnteService->getDeviceStatus($deviceToken);

            if ($response['status']) {
                return response()->json([
                    'status' => true,
                    'data' => $response['data']
                ]);
            }

            return response()->json([
                'status' => false,
                'error' => $response['error'] ?? 'Failed to check device status'
            ], 400);
        } catch (Exception $e) {
            Log::error('Error checking device status: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'error' => 'Internal server error'
            ], 500);
        }
    }
    
    public function getAccountInfo(): JsonResponse
    {
        try {
            $response = $this->fonnteService->getAccountInfo();

            if ($response['status']) {
                return response()->json([
                    'status' => true,
                    'data' => $response['data']
                ]);
            }

            return response()->json([
                'status' => false,
                'error' => $response['error'] ?? 'Failed to get account info'
            ], 400);
        } catch (Exception $e) {
            Log::error('Error getting account info: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'error' => 'Internal server error'
            ], 500);
        }
    }
}
