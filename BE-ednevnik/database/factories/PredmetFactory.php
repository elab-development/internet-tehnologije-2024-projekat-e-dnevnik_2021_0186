<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Predmet>
 */
class PredmetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'naziv' => $this->faker->randomElement(['Matematika', 'Fizika', 'Hemija', 'Istorija', 'Biologija']),
            'opis' => $this->faker->sentence(),
            'tezina' => $this->faker->numberBetween(1, 5),
            'profesor_id' => \App\Models\Profesor::factory(),
        ];
    }
}
