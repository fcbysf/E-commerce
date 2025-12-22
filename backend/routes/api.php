<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;

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
Route::get('/users', [UserController::class,'index']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user()->id;
});
//  PRODUCT ROUTES
Route::get('homeProducts', [ProductController::class,'homeProducts']);
Route::get('sameCategoryProducts', [ProductController::class,'sameCategoryProducts']);
Route::get('adminProducts', [ProductController::class,'adminProducts']);
Route::apiResource('product', ProductController::class);

//  CART ROUTES
Route::middleware(['auth:sanctum'])->apiResource('cart', CartController::class);

//  ORDER ROUTES
Route::middleware(['auth:sanctum'])->apiResource('order', OrderController::class);
Route::middleware(['auth:sanctum'])->get('userOrders', [OrderController::class,'userOrders']);


