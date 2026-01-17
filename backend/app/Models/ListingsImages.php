<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingsImages extends Model
{
    protected $fillable = [
        'listings_id',
        'image_url',
    ];
    public function listings(){
        return $this->belongsTo(Listings::class);
    }
}
