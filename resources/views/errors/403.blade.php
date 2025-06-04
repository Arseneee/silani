@extends('errors::minimal')

@section('title', __('Akses Ditolak'))
@section('code', '403')
@section('message', __($exception->getMessage() ?: 'Anda tidak memiliki hak akses ke halaman ini. Silakan hubungi administrator jika ini kesalahan.'))
