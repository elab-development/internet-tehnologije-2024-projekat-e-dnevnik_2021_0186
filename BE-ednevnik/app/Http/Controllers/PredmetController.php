<?php

namespace App\Http\Controllers;

use App\Http\Resources\PredmetResource;
use App\Models\Predmet;
use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PredmetController extends Controller
{
    public function index()
    {
        $predmeti = Predmet::paginate(10); // Paginacija po 10 zapisa
        return PredmetResource::collection($predmeti);
    }


    //dodaj predmet - admin
    public function store(Request $request)
    {
        $user = Auth::user();

        // Provera da li je ulogovani korisnik admin
        if ($user->tip_korisnika !== 'admin') {
            return response()->json(['error' => 'Nemate dozvolu za ovu akciju.'], 403);
        }

        $validated = $request->validate([
            'naziv' => 'required|string',
            'opis' => 'nullable|string',
            'tezina' => 'required|numeric',
            'profesor_id' => 'required|exists:profesori,id', // provera da li postoji
        ]);

        $predmet = Predmet::create($validated);

        return response()->json([
            'message' => 'Predmet uspešno dodat.',
            'predmet' => new PredmetResource($predmet),
        ], 201);
    }

    // Ažuriranje predmeta - admin
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        // Provera da li je ulogovani korisnik admin
        if ($user->tip_korisnika !== 'admin') {
            return response()->json(['error' => 'Nemate dozvolu za ovu akciju.'], 403);
        }

        $predmet = Predmet::findOrFail($id);

        $validated = $request->validate([
            'naziv' => 'required|string',
            'opis' => 'nullable|string',
            'tezina' => 'required|numeric',
            'profesor_id' => 'required|exists:profesori,id',
        ]);

        $predmet->update($validated);

        return response()->json([
            'message' => 'Predmet uspešno azuriran.',
            'predmet' => new PredmetResource($predmet),
        ]);
    }

    //ukloni profesora sa predmeta - za admina
    public function ukloniProfesora($id)
    {
        $user = Auth::user();

        if (!$user || $user->tip_korisnika !== 'admin') {
            return response()->json(['message' => 'Niste autorizovani za ovu akciju.'], 403);
        }

        $predmet = Predmet::findOrFail($id);

        $predmet->profesor_id = null;
        $predmet->save();

        return response()->json([
            'message' => 'Profesor je uspešno uklonjen sa predmeta.',
            'predmet' => new PredmetResource($predmet),
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if (!$user || $user->tip_korisnika !== 'admin') {
            return response()->json(['message' => 'Niste autorizovani za ovu akciju.'], 403);
        }

        $predmet = Predmet::findOrFail($id);
        $predmet->delete();

        return response()->json(['message' => 'Predmet uspešno obrisan.']);
    }

    //metrike za admina
    public function getMetricsForAdmin()
    {
        if (Auth::user()->tip_korisnika !== 'admin') {
            return response()->json(['error' => 'Nemate dozvolu'], 403);
        }

        $predmeti_po_profesoru = Profesor::withCount('predmeti')->get(['id', 'ime']);
        $ocene_po_predmetu = Predmet::withCount('ocene')->get(['id', 'naziv']);

        return response()->json([
            'predmeti_po_profesoru' => $predmeti_po_profesoru,
            'ocene_po_predmetu' => $ocene_po_predmetu
        ]);
    }

     //pregled dostupnih predmeta za izbor - za profesora
     public function dostupniPredmeti()
     {
         if (Auth::user()->tip_korisnika !== 'profesor') {
             return response()->json(['error' => 'Nemate dozvolu'], 403);
         }
 
         $predmeti = Predmet::whereNull('profesor_id')->get();
         return PredmetResource::collection($predmeti);
     }


}
