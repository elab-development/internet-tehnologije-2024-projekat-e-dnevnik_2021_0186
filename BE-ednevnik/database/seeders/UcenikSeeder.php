<?php

namespace Database\Seeders;

use App\Models\Roditelj;
use App\Models\Ucenik;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UcenikSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roditelj = Roditelj::first(); //prvi roditelj iz baze

        $ucenikUser1 = User::factory()->create([
            'email' => 'ucenik@example.com',
            'password' => bcrypt('ucenikpassword'),
            'tip_korisnika' => 'ucenik',
        ]);

        $ucenikUser2 = User::factory()->create([
            'email' => 'ucenikdva@example.com',
            'password' => bcrypt('ucenikpassword'),
            'tip_korisnika' => 'ucenik',
        ]);

        Ucenik::factory()->create([
            'user_id' => $ucenikUser1->id,
            'ime' => 'Petar Petrović',
            'razred' => '3',
            'odeljenje' => '2',
            'roditelj_id' => $roditelj->id,
        ]);

        Ucenik::factory()->create([
            'user_id' => $ucenikUser2->id,
            'ime' => 'Maja Petrovic',
            'razred' => '5',
            'odeljenje' => '2',
            'roditelj_id' => $roditelj->id,
        ]);

            // Pronalazimo sve roditelje osim onog čiji je ID 1
    $sviRoditelji = Roditelj::where('id', '!=', 1)->pluck('id')->toArray();

    // Kreiramo još 8 učenika sa random roditeljima (ali ne ID = 1)
    for ($i = 0; $i < 8; $i++) {
        $randomRoditeljId = fake()->randomElement($sviRoditelji); // Nasumičan roditelj, ali ne ID 1

        $ucenikUser = User::factory()->create([
            'tip_korisnika' => 'ucenik',
        ]);

        Ucenik::factory()->create([
            'user_id' => $ucenikUser->id,
            'roditelj_id' => $randomRoditeljId
        ]);
    }


    }
}
