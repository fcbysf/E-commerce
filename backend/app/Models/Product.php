<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'image',
        'price',
        'discount',
        'stock',
        'category',
    ];
    public function images(){
        return $this->hasMany(ProductImages::class);
    }
}
