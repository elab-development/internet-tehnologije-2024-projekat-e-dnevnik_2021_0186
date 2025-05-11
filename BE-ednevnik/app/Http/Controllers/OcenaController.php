<?php

namespace App\Http\Controllers;

use App\Http\Resources\OcenaResource;
use App\Http\Resources\UcenikResource;
use App\Models\Ocena;
use App\Models\Profesor;
use App\Models\Roditelj;
use App\Models\Ucenik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OcenaController extends Controller
{
    public function index()
    {
        $ocene = Ocena::paginate(10); 
        return OcenaResource::collection($ocene);
    }

    //za ucenika da vidi svoje ocene
    public function vratiMojeOcene()
    {
        $user = Auth::user();

        // Provera da li je korisnik ulogovan i da li je ucenik
        if (!$user || $user->tip_korisnika !== 'ucenik') {
            return response()->json(['error' => 'Nemate dozvolu za ovu akciju.'], 403);
        }

        // Pronalazak ucenika na osnovu user_id
        $ucenik = Ucenik::where('user_id', $user->id)->first();

        if (!$ucenik) {
            return response()->json(['error' => 'Učenik nije pronađen.'], 404);
        }

        // Dohvatanje svih ocena koje pripadaju učeniku
        $ocene = Ocena::with(['predmet', 'ucenik'])->where('ucenik_id', $ucenik->id)->get();

        // Vraćamo resurs kroz kolekciju
        return OcenaResource::collection($ocene);
    }

    //za roditelja
    public function vratiOceneMojeDece()
    {
        $user = Auth::user();

        // Provera da li je korisnik roditelj
        if (!$user || $user->tip_korisnika !== 'roditelj') {
            return response()->json(['error' => 'Nemate dozvolu za ovu akciju.'], 403);
        }

        // Pronalazak roditelja na osnovu user_id
        $roditelj = Roditelj::where('user_id', $user->id)->first();

        if (!$roditelj) {
            return response()->json(['error' => 'Roditelj nije pronađen.'], 404);
        }

        // Dohvatanje učenika i njihovih ocena
        $ucenici = Ucenik::with(['ocene.predmet.profesor'])->where('roditelj_id', $roditelj->id)->get();

        return  UcenikResource::collection($ucenici);
    }

    //za profesora da upise ocene ucenicima
    public function azurirajOcenu(Request $request)
    {
        $user = Auth::user();

        if ($user->tip_korisnika !== 'profesor') {
            return response()->json(['error' => 'Nemate pristup.'], 403);
        }

        $validated = $request->validate([
            'ocena_id' => 'required|exists:ocene,id',
            'ocena' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string',
        ]);

        $ocena = Ocena::with('predmet')->findOrFail($validated['ocena_id']);

        // Da li profesor pradaje taj predmet
        $profesor = Profesor::where('user_id', $user->id)->first();

        if (!$profesor || $ocena->predmet->profesor_id !== $profesor->id) {
            return response()->json(['error' => 'Nemate pravo da izmenite ovu ocenu.'], 403);
        }

        // Ažuriramo ocenu
        $ocena->update([
            'ocena' => $validated['ocena'],
            'komentar' => $validated['komentar'],
            'datum' => now()->toDateString(), //da bude samo dan
        ]);

        return response()->json([
            'message' => 'Ocena uspešno ažurirana.',
            'data' => $ocena->load('ucenik')
        ]);
    }

    

}
