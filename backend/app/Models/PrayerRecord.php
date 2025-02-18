<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Users;

class PrayerRecord extends Model
{
    protected $fillable = [
        'user_id',
        'date', // Tanggal sholat
    
        'subuh_status',
        'subuh_reason',
        'subuh_image',
        'subuh_time',
        'subuh_latitude',
        'subuh_longitude',
    
        'dzuhur_status',
        'dzuhur_reason',
        'dzuhur_image',
        'dzuhur_time',
        'dzuhur_latitude',
        'dzuhur_longitude',
    
        'asar_status',
        'asar_reason',
        'asar_image',
        'asar_time',
        'asar_latitude',
        'asar_longitude',
    
        'maghrib_status',
        'maghrib_reason',
        'maghrib_image',
        'maghrib_time',
        'maghrib_latitude',
        'maghrib_longitude',
    
        'isya_status',
        'isya_reason',
        'isya_image',
        'isya_time',
        'isya_latitude',
        'isya_longitude',

        'tarawih_status',
        'tarawih_reason',
        'tarawih_image',
        'tarawih_time',
        'tarawih_latitude',
        'tarawih_longitude',
    ];

    public function user()
    {
        return $this->belongsTo(Users::class);
    }
    
}
