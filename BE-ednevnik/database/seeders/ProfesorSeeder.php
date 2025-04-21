<?php

namespace Database\Seeders;

use App\Models\Predmet;
use App\Models\Profesor;
use App\Models\User;
use Database\Factories\ProfesorFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProfesorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //kreiramo usera i njegove podatke
        $profesorUser = User::factory()->create([
            'email' => 'profesor@example.com',
            'password' => bcrypt('profesorpassword'),
            'tip_korisnika' => 'profesor',
        ]);

        //dopunjujemo profesora i povezujemo sa tim nalogom
        $profesor = Profesor::factory()->create([
            'user_id' => $profesorUser->id,
            'ime' => 'Marko Marković',
            'titula' => 'Docent',
        ]);

        $predmeti = [
            ['naziv' => 'Vajanje', 'opis' => 'Osnove vajarstva za učenike', 'tezina' => 2],
            ['naziv' => 'Ruski jezik', 'opis' => 'Ruski jezik A1 nivoa težine', 'tezina' => 2],
            ['naziv' => 'Ruski jezik - napredni nivo', 'opis' => 'Ruski jezik A2 nivoa težine', 'tezina' => 4]
        ];

        foreach ($predmeti as $predmet) {
            Predmet::factory()->create([
                'naziv' => $predmet['naziv'],
                'opis' => $predmet['opis'],
                'tezina' => $predmet['tezina'],
                'profesor_id' => $profesor->id,
            ]);
        }

        //dodatni random profesori koji predaju po 1 predmet - u predmet seederu
        Profesor::factory(4)->create()->each(function ($profesor) {
            $user = User::factory()->create([
                'tip_korisnika' => 'profesor',
            ]);

            // Ažuriramo profesora tako da bude povezan sa korisnikom
            $profesor->update(['user_id' => $user->id]);
        });

    }
}
