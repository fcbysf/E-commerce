<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;


//auth routes

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
//  PRODUCT ROUTES
Route::get('homeProducts', [ProductController::class,'homeProducts']);
Route::get('sameCategoryProducts', [ProductController::class,'sameCategoryProducts']);
Route::apiResource('product', ProductController::class);

//  CART ROUTES
Route::middleware(['auth:sanctum'])->apiResource('cart', CartController::class);
