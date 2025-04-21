<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;


class AuthController extends Controller
{
    /**
     * Registracija novog korisnika.
     */
    public function register(Request $request)
    {
        // Validacija unosa
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
            'tip_korisnika' => 'required|in:profesor,ucenik,roditelj',
            
        ]);

        // Kreiranje korisnika
        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tip_korisnika' => $request->tip_korisnika,
        ]);

        // Generisanje tokena
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Korisnik uspešno registrovan.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Logovanje korisnika.
     */
    public function login(Request $request)
    {
         // Validacija unosa
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Provera kredencijala
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Neispravni podaci za prijavu.'
            ], 401);
        }

        // Dohvatanje ulogovanog korisnika
        $user = Auth::user();

        // Dohvatanje ID-a iz odgovarajućeg modela na osnovu tipa korisnika
        $relatedModelId = null;
        switch ($user->tip_korisnika) {
            case 'profesor':
                $relatedModelId = $user->profesor ? $user->profesor->id : null;
                break;
            case 'ucenik':
                $relatedModelId = $user->ucenik ? $user->ucenik->id : null;
                break;
            case 'roditelj':
                $relatedModelId = $user->roditelj ? $user->roditelj->id : null;
                break;
            case 'admin':
                // Admin nema dodatni model, pa ostavljamo null ili neki podrazumevani ID
                $relatedModelId = null;
                break;
        }

        // Generisanje tokena
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Uspešno ste se prijavili.',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'tip_korisnika' => $user->tip_korisnika,
                'related_model_id' => $relatedModelId, // ID iz odgovarajućeg modela
            ],
            'token' => $token,
        ]);
    }

    /**
     * Izlogovanje korisnika.
     */
    public function logout(Request $request)
    {
        // Brisanje tokena za trenutnog korisnika
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Uspešno ste se odjavili.',
        ]);
    }
}
