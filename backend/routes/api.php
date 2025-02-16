<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\PrayerRecordController;
use App\Http\Controllers\KegiatanController;

Route::post('/auth/signup', [AuthController::class, 'register']);
Route::post('/auth/signin', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', function(Request $r) {
        return response()->json($r->user());
    });
    Route::apiResource('/prayer-records', PrayerRecordController::class);
    Route::get('/prayer-records/user/{user_id}', [PrayerRecordController::class, 'getByUserId']);
    
    Route::apiResource('/kegiatan', KegiatanController::class);
    Route::get('/kegiatan/user/{user_id}', [KegiatanController::class, 'getByUserId']);
    Route::post('/kegiatan/kultum/add', [KegiatanController::class, 'storeKultum']);
    Route::get('/kegiatan/kultum/user/{user_id}', [KegiatanController::class, 'getKultumByUserId']);
});