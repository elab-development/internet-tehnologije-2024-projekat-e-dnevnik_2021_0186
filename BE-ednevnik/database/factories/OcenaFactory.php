<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ocena>
 */
class OcenaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ucenik_id' => \App\Models\Ucenik::factory(),
            'predmet_id' => \App\Models\Predmet::factory(),
            'ocena' => $this->faker->numberBetween(1, 5),
            'datum' => $this->faker->date(),
            'komentar' => $this->faker->optional()->sentence(),
        ];
    }
}
