@extends('errors::minimal')

@section('title', __('Terlalu Banyak Permintaan'))
@section('code', '429')
@section('message', __('Anda terlalu sering melakukan permintaan. Coba lagi nanti.'))
