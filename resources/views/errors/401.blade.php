@extends('errors::minimal')

@section('title', __('Tidak Diizinkan'))
@section('code', '401')
@section('message', __('Anda belum login atau tidak memiliki izin untuk mengakses halaman ini.'))
