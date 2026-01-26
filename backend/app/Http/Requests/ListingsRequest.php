<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|min:3',
            'description' => 'sometimes|min:10',
            'price' => 'sometimes|numeric|min:0',
            'images' => 'sometimes|array',
            'images.*' => 'sometimes|image|file|max:2042',
            'category' => 'sometimes|exists:categories,slug',
            'location' => 'sometimes|min:3',
            'deletedImgIds' => 'sometimes|array',
            'deletedImgIds.*' => 'string',
            'status' => 'sometimes|string|in:active,sold'
        ];
    }
}
