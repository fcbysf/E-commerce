<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listings extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
    ];
    public function images(){
        return $this->hasMany(ListingsImages::class);
    }
    
    public function categorie()  {
        return $this->belongsTo(Categories::class);
    }

}
