<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingsImages extends Model
{
    protected $fillable = [
        'listing_id',
        'image',
    ];
    public function listings(){
        return $this->belongsTo(Listings::class);
    }
}
