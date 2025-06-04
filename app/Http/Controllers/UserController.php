<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Helpers\LogActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role', 'no_hp')
            ->orderBy('name')
            ->get();

        return Inertia::render('User/Index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'role'  => 'required|string',
            'no_hp' => 'required|string|max:20',
        ]);

        $user = User::create([
            ...$validated,
            'password' => Hash::make('silani'),
        ]);

        LogActivity::add('create', "Menambahkan user baru: {$user->name} ({$user->email}) dengan role {$user->role}");

        return redirect()->back()->with('success', 'User berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $oldData = $user->toArray();

        $validated = $request->validate([
            'name'  => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role'  => 'required|string',
            'no_hp' => 'required|string|max:20',
        ]);

        $user->update($validated);
        $newData = $user->toArray();

        if ($oldData['name'] !== $newData['name']) {
            LogActivity::add('update', "Mengubah nama user dari {$oldData['name']} menjadi {$newData['name']}");
        }

        if ($oldData['email'] !== $newData['email']) {
            LogActivity::add('update', "Mengubah email user {$user->name} dari {$oldData['email']} menjadi {$newData['email']}");
        }

        if ($oldData['role'] !== $newData['role']) {
            LogActivity::add('update', "Mengubah role user {$user->name} dari {$oldData['role']} menjadi {$newData['role']}");
        }

        if ($oldData['no_hp'] !== $newData['no_hp']) {
            LogActivity::add('update', "Mengubah no HP user {$user->name} dari {$oldData['no_hp']} menjadi {$newData['no_hp']}");
        }

        return redirect()->back()->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        LogActivity::add('delete', "Menghapus user: {$user->name} ({$user->email})");

        $user->delete();

        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }
}