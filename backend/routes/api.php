<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\FavouriteController;
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
Route::put('/user/{user}', [UserController::class,'update']);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    $user = $request->user();
    $user->load('orders','cart');
    $orders_len = count($user->orders);
    $cart_len = count($user->cart);

    return response()->json(['user_id'=>$request->user()->id, 'role'=>$request->user()->role, "orders"=>$orders_len, 'cart' => $cart_len]);
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

// favourite Routes
Route::get('/favourites', [FavouriteController::class, 'index']);
Route::post('/favourites', [FavouriteController::class, 'store']);
Route::delete('/favourites/{favourite}', [FavouriteController::class, 'destroy']);