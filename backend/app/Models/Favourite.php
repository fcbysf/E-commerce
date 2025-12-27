<?php

namespace App\Models;

use App\Http\Controllers\ProductController;
use Illuminate\Database\Eloquent\Model;

class Favourite extends Model
{
    protected $fillable = ['product_id','user_id'];
    public function product(){
        return $this->belongsTo(ProductController::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
}
