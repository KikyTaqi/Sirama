<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kegiatan extends Model
{
    protected $table="kegiatan";

    protected $fillable= [
        'user_id',
        'date',
        'puasa',
        'reason',
        'tadarus',
    ];

    public function user()
    {
        return $this->belongsTo(Users::class, 'user_id', 'id');
    }
}
