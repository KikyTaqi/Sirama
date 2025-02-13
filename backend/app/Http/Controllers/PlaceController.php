<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Place;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class PlaceController extends Controller
{
    public function index()
    {
        return response()->json(Place::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'image' => 'nullable|image|max:2048', // Maks 2MB
        ]);

        if($request->hasFile('image')){
            $logo = $request->file('image');
            $logoname = $logo->hashName();
            $logo->move(public_path('images'), $logoname);
        } else {
            $logoname = null;
        }

        $place = Place::create([
            'title' => $request->title,
            'description' => $request->description,
            'image' => $logoname,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json($place, 201);
    }

    public function show($id)
    {
        return response()->json(Place::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $place = Place::findOrFail($id);

        // Simpan nama file lama sebelum diupdate
        $oldImage = $place->image;

        // Update data kecuali image dulu
        $place->update($request->except('image'));

        // Jika ada file gambar baru yang diunggah
        if ($request->hasFile('image')) {
            // Simpan gambar baru
            $image = $request->file('image');
            $imageName = $image->hashName();
            $image->move(public_path('images'), $imageName);

            // Hapus gambar lama jika ada
            if ($oldImage && file_exists(public_path('images/' . $oldImage))) {
                unlink(public_path('images/' . $oldImage));
            }

            // Update nama gambar di database
            $place->image = $imageName;
            $place->save();
        }

        return response()->json(['message' => 'Updated successfully', 'place' => $place]);
    }



    

    public function destroy($id)
    {
        $place = Place::findOrFail($id);

        // Hapus gambar jika ada
        if ($place->image && File::exists(public_path('images/' . $place->image))) {
            File::delete(public_path('images/' . $place->image));
        }

        // Hapus data dari database
        $place->delete();

        return response()->json(['message' => 'Place deleted successfully']);
    }

}
