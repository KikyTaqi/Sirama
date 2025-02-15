<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\PrayerRecordController;

Route::post('/auth/signup', [AuthController::class, 'register']);
Route::post('/auth/signin', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', function(Request $r) {
        return response()->json($r->user());
    });
    Route::apiResource('/prayer-records', PrayerRecordController::class);
    Route::get('/prayer-records/user/{user_id}', [PrayerRecordController::class, 'getByUserId']);

    
});
Route::apiResource('/places', PlaceController::class);

