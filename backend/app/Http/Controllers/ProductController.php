<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImages;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }



    public function store(Request $request)
    {
        $productData = $request->validate([
            'name' => 'required',
            'description' => 'required',
            'image' => 'required',
            'price' => 'required',
            'discount' => 'nullable',
            'stock' => 'required',
            'category' => 'nullable'
        ]);
        $file= $request->file('image');
        $file->store('images', 'public');
        $productData['image'] = url('storage/images/' . $file->hashName());
        $product=Product::create($productData);
        foreach($request->file('images') as $file) {
            $file->store('images', 'public');
            $filePath = url('storage/images/' . $file->hashName());
            ProductImages::create([
                'product_id' => $product->id,
                'image_url' => $filePath
            ]);
        }
        return response()->json($product->load('images'));
    }
    
    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}

