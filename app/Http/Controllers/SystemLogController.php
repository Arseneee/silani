<?php

namespace App\Http\Controllers;

use App\Models\SystemLog;
use Illuminate\Http\Request;

class SystemLogController extends Controller
{
    public function index(Request $request)
    {
        $query = SystemLog::with('user')->orderBy('created_at', 'desc');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('activity', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%")
                    ->orWhereHas('user', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%$search%");
                    });
            });
        }

        // Bisa tambah filter activity jika mau
        if ($request->activity) {
            $query->where('activity', $request->activity);
        }

        $logs = $query->paginate(20)->withQueryString();

        return inertia('SystemLog/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'activity']),
        ]);
    }
}
