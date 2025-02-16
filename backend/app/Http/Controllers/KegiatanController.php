<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Users;
use App\Models\Kegiatan;
use App\Models\Kultum;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class KegiatanController extends Controller
{
    public function index()
    {
        $kegiatan = Kegiatan::all();
        return response()->json($kegiatan);
    }

    public function store(Request $req)
    {
        $req->validate([
            'puasa' => 'required|string|max:10',
            'tadarus' => 'string|max:255',
            'reason' => 'string|max:255',
        ]);

        error_log("REQ: ".$req->reason);

        $user = auth()->user();
        $today = now()->toDateString();

        $kegiatan = Kegiatan::create([
            'user_id' => $user->id,
            'date' => $today,
            'puasa' => $req->puasa,
            'reason' => $req->reason ?? null,
            'tadarus' => $req->tadarus == "null" ? null : $req->tadarus,
        ]);

        return response()->json(['message' => 'Kegiatan added successfully']);
    }
    
    public function show($id)
    {
        return response()->json(Kegiatan::findOrFail($id));
    }

    public function getByUserId($user_id)
    {
        $user = auth()->user();

        $kegiatan = Kegiatan::where('user_id', $user_id)->orderBy('id', 'DESC')->get();
        $kultum = Kultum::where('user_id', $user_id)->orderBy('id', 'DESC')->get();

        return response()->json(['kegiatan' => $kegiatan, 'kultum' => $kultum]);
    }

    public function getKultumByUserId($user_id)
    {
        $user = auth()->user();

        $records = Kultum::where('user_id', $user_id)->orderBy('id', 'DESC')->get();

        return response()->json($records);
    }

    public function storeKultum(Request $req)
    {
        $req->validate([
            'date' => 'required|date',
            'ramadhan' => 'required|integer|max:30',
            'penceramah' => 'required|string|max:255',
            'tempat' => 'required|string|max:255',
            'ringkasan' => 'required|string|max:255',
        ]);
    
        // error_log("REQ: ".$req->reason);
    
        $user = auth()->user();
    
        $kegiatan = Kultum::create([
            'user_id' => $user->id,
            'date' => $req->date,
            'ramadhan' => $req->ramadhan,
            'penceramah' => $req->penceramah,
            'tempat' => $req->tempat,
            'ringkasan' => $req->ringkasan,
        ]);
    
        return response()->json(['message' => 'Kegiatan added successfully']);
    }
}
