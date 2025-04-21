<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profesor>
 */
class ProfesorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory()->create(['tip_korisnika' => 'profesor'])->id,
            'ime' => $this->faker->firstName(),
            'titula' => $this->faker->randomElement(['Docent', 'Vanredni profesor', 'Redovni profesor']),
            'kabinet' => $this->faker->numberBetween(100, 500),
            'konsultacije' => $this->faker->dayOfWeek() . ' ' . $this->faker->time('H:i') . '-' . $this->faker->time('H:i'),
        ];
    }
}
