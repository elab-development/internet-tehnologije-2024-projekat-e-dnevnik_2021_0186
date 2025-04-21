<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Roditelj>
 */
class RoditeljFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory()->create(['tip_korisnika' => 'roditelj'])->id,
            'ime' => $this->faker->firstName(),
            'kontakt' => $this->faker->phoneNumber(),
        ];
    }
}
