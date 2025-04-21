<?php

use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\RoditeljController;
use App\Http\Controllers\UcenikController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


Route::post('/register',[AuthController::class,'register']);
Route::post('/login', [AuthController::class, 'login']);

//da se prilikom registracije poziva i ovo kreiranje
Route::post('/roditelj', [RoditeljController::class, 'store']);
Route::post('/ucenik', [UcenikController::class, 'store']);
Route::post('/profesor', [ProfesorController::class, 'store']);

//prikaz svih modela
Route::get('/roditelji', [RoditeljController::class, 'index']);
Route::get('/ucenici', [UcenikController::class, 'index']);
Route::get('/profesori', [ProfesorController::class, 'index']);

//zasticena grupna ruta
Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    //rute za roditelja - prikaz i azuriranje profila
    Route::get('/roditelji/{id}', [RoditeljController::class, 'show']);
    Route::put('/roditelji/{id}', [RoditeljController::class, 'update']);

    //rute za ucenike - prikaz i azuriranje profila
    Route::get('/ucenici/{id}', [UcenikController::class, 'show']);
    Route::put('/ucenici/{id}', [UcenikController::class, 'update']);

    //za profesora - sta sve radi
    Route::get('/profesori/{id}', [ProfesorController::class, 'show']);
    Route::put('/profesori/{id}', [ProfesorController::class, 'update']);
    Route::post('/profesori/dodaj-predmet', [ProfesorController::class, 'dodajPredmet']);
    Route::delete('/profesori/ukloni-predmet/{predmet_id}', [ProfesorController::class, 'ukloniPredmet']);




});  