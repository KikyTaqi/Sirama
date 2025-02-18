<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kultum extends Model
{
    protected $table="kultum";

    protected $fillable= [
        'user_id',
        'date',
        'ramadhan',
        'penceramah',
        'tempat',
        'ringkasan',
    ];

    public function user()
    {
        return $this->belongsTo(Users::class, 'user_id', 'id');
    }
}
