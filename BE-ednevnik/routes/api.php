<?php

use App\Http\Controllers\RoditeljController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


Route::post('/register',[AuthController::class,'register']);
Route::post('/login', [AuthController::class, 'login']);

//da se prilikom registracije poziva i ovo kreiranje
Route::post('/roditelj', [RoditeljController::class, 'store']);

//prikaz svih modela
Route::get('/roditelji', [RoditeljController::class, 'index']);

//zasticena grupna ruta
Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    //rute za roditelja - prikaz i azuriranje profila
    Route::get('/roditelji/{id}', [RoditeljController::class, 'show']);
    Route::put('/roditelji/{id}', [RoditeljController::class, 'update']);




});  