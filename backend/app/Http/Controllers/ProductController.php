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
    public function homeProducts()
    {
           return Product::with('images')
            ->latest()
            ->take(6)
            ->get();
    }
    public function index(Request $request){
        $category=$request->category;
        if($category=='allCategories'||!$category){
            return Product::whereBetween('price', [$request->min,$request->max])->latest()->paginate(40);
        }
        else{
            return Product::where('category',$category)->whereBetween('price', [$request->min,$request->max])->latest()->paginate(40);
        }
    }


    public function store(Request $request)
    {
        $productData = $request->validate([
            'name' => 'required|min:6',
            'description' => 'required|min:10',
            'image' => 'required|image|file',
            'price' => 'required|numeric',
            'discount' => 'nullable',
            'images'=>'required|array',
            'images.*' => 'required|image|file',
            'stock' => 'required|numeric',
            'category' => 'nullable'
        ]);
        $file= $request->file('image');
        $file->store('images', 'public');
        $productData['image'] = url('storage/images/' . $file->hashName());
        $product=Product::create($productData);
        if($request->file('images')){
        foreach($request->file('images') as $file) {
            $file->store('images', 'public');
            $filePath = url('storage/images/' . $file->hashName());
            ProductImages::create([
                'product_id' => $product->id,
                'image_url' => $filePath
            ]);
        }
    }
        return response()->json($product->load('images'));
    }
    
    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return $product->load('images');
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
    public function sameCategoryProducts(Request $request){
        $category=$request->category;
        return Product::where('category',$category)->latest()->paginate(40);

    }
}

