<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $data = [
            'id' => $this->id,
            'email' => $this->email,
            'tip_korisnika' => $this->tip_korisnika,
        ];

        if ($this->tip_korisnika === 'profesor') {
            $data['profesor_id'] = $this->profesor ? $this->profesor->id : null;
        } elseif ($this->tip_korisnika === 'ucenik') {
            $data['ucenik_id'] = $this->ucenik ? $this->ucenik->id : null;
        } elseif ($this->tip_korisnika === 'roditelj') {
            $data['roditelj_id'] = $this->roditelj ? $this->roditelj->id : null;
        }

        return $data;
    }
}
