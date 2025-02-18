<?php

namespace App\Http\Controllers;

use App\Models\PrayerRecord;
use App\Models\Users;
use App\Models\Kultum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PrayerRecordController extends Controller
{
    public function index()
    {
        $records = PrayerRecord::all();
        return response()->json($records);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $today = now()->toDateString();

        // Cek apakah sudah ada record hari ini
        $record = PrayerRecord::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if (!$record) {
            $record = PrayerRecord::create([
                'user_id' => $user->id,
                'date' => $today,
            ]);
        }

        // Update berdasarkan waktu sholat yang dipilih
        $prayer = $request->input('prayer'); // subuh, dzuhur, asar, maghrib, isya

        $record->update([
            "{$prayer}_status" => $request->status, // iya/tidak
            "{$prayer}_reason" => $request->reason,
            "{$prayer}_time" => now()->format('H:i:s'),
            "{$prayer}_latitude" => $request->latitude,
            "{$prayer}_longitude" => $request->longitude,
        ]);

        // Kalau ada gambar
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('prayer_images', 'public');
            $record->update(["{$prayer}_image" => $imagePath]);
        }

        return response()->json(['message' => 'Prayer record updated successfully', 'data' => $record]);
    }


    public function show($id)
    {
        return response()->json(PrayerRecord::findOrFail($id));
        
    }

    public function getByUserId($user_id)
    {
        $user = auth()->user();
        $records = PrayerRecord::where('user_id', $user->id)->get();

        return response()->json($records);
    }


    public function update(Request $request, $id)
    {
        $record = PrayerRecord::findOrFail($id);

        $prayerTime = $request->prayer_time;
        $user = auth()->user();
        $today = now()->toDateString();

        error_log($record);
        error_log(json_encode($request->all())); // Debugging
        
        $record->update([
            "tarawih_status" => $request->input("terawih_status"),
            "tarawih_latitude" => $request->input("terawih_latitude"),
            "tarawih_longitude" => $request->input("terawih_longitude"),
            "tarawih_time" => $request->input("terawih_time"),
        ]);
        
        if ($request->hasFile("terawih_image")) {
            $imagePath = $request->file("terawih_image")->store('prayer_images', 'public');
            $record->update(["tarawih_image" => $imagePath]);
        }

        if ($request->filled("terawih_reason")) {
            $record->update(["tarawih_reason" => $request->input("terawih_reason")]);
        }

        if ($request->kultum === 'iya') {
            $kultum = Kultum::create([
                'user_id' => $user->id,
                'date' => $today,
                'ramadhan' => $request->ramadhan,
                'penceramah' => $request->penceramah,
                'tempat' => $request->tempat,
                'ringkasan' => $request->ringkasan,
            ]);
        }

        error_log("PART3: ".$record);
        return response()->json($record);
    }


    public function destroy($id)
    {
        $record = PrayerRecord::findOrFail($id);

        // Hapus semua gambar terkait
        foreach (['subuh', 'dzuhur', 'asar', 'maghrib', 'isya'] as $waktu) {
            $imageKey = $waktu . '_image';
            if ($record[$imageKey]) {
                Storage::disk('public')->delete($record[$imageKey]);
            }
        }

        $record->delete();

        return response()->json(['message' => 'Prayer record deleted successfully!']);
    }

    public function status(Request $request)
    {
        $userId = $request->user()->id;
        $todayRecords = PrayerRecord::where('user_id', $userId)
            ->whereDate('created_at', today())
            ->get()
            ->keyBy('prayer_time');

        $statuses = [
            'subuh' => $todayRecords->has('subuh') ? 'sudah' : 'belum',
            'dzuhur' => $todayRecords->has('dzuhur') ? 'sudah' : 'belum',
            'asar' => $todayRecords->has('asar') ? 'sudah' : 'belum',
            'maghrib' => $todayRecords->has('maghrib') ? 'sudah' : 'belum',
            'isya' => $todayRecords->has('isya') ? 'sudah' : 'belum',
        ];

        return response()->json($statuses);
    }

}
