<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Users;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        $validator = $request->validate([
            'nis' => 'required|string|max:255|unique:users',
            'name' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'password' => 'required|string|min:6',
        ]);

        // if ($validator->fails()) {
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'Validation failed',
        //         'errors' => $validator->errors()
        //     ], 422); // Status 422 untuk unprocessable entity
        // }

        $user = Users::create([
            'nis' => $request->nis,
            'name' => $request->name,
            'kelas' => $request->kelas,
            'role' => "siswa",
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User registered successfully']);
    }

    // LOGIN
    public function login(Request $request)
    {
        try{
            $request->validate([
                'nis' => 'required',
                'password' => 'required',
            ]);
    
            $user = Users::where('nis', $request->nis)->first();
    
            if (!$user || !Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }
    
            $token = $user->createToken('auth_token')->plainTextToken;
    
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user
            ]);
        }catch(err){
            return response()->json([
                'message' => 'Login failed',
                'error' => $err
            ]);
        }
    }

    // LOGOUT
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
