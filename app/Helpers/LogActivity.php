<?php

namespace App\Helpers;

use App\Models\SystemLog;
use Illuminate\Support\Facades\Auth;

class LogActivity
{
    public static function add(string $activity, ?string $description = null): void
    {
        SystemLog::create([
            'user_id' => Auth::id(),
            'activity' => $activity,
            'description' => $description,
        ]);
    }
}
