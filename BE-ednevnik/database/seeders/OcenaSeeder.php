<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ocena;
use App\Models\Ucenik;
use App\Models\Predmet;

class OcenaSeeder extends Seeder
{
    public function run()
    {
        $ucenici = Ucenik::all();
        $predmeti = Predmet::whereIn('id', range(1, 9))->get(); // Predmeti sa ID 1-9

        foreach ($ucenici as $ucenik) {
            $imaOcenu = true; // Početna vrednost da učenik naizmenično dobija ocenu

            foreach ($predmeti as $predmet) {
                Ocena::create([
                    'ucenik_id' => $ucenik->id,
                    'predmet_id' => $predmet->id,
                    'ocena' => $imaOcenu ? rand(1, 5) : null, // Naizmenično dodeljuje ocenu
                    'datum' => $imaOcenu ? now()->subDays(rand(1, 30)) : null,
                    'komentar' => $imaOcenu ? 'Dobro urađeno!' : 'Nije ocenjeno',
                ]);

                $imaOcenu = !$imaOcenu; // Naizmenično menjamo da li učenik ima ocenu ili ne
            }
        }
    }
}
