<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


Route::post('/register',[AuthController::class,'register']);
Route::post('/login', [AuthController::class, 'login']);


//zasticena grupna ruta
Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::post('/logout', [AuthController::class, 'logout']);

});  