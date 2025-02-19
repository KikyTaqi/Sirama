<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Users;

class GuruSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Users::insert([
            [
                'nis' => '19841213 202221 2 011',
                'name' => 'Wulan Fitriyani, S.Pd.',
                'kelas' => 'X TO 1',
                'role' => 'guru',
                'password' => Hash::make('19841213 202221 2 011'),
            ],
            [
                'nis' => '19880304 202421 1 014',
                'name' => 'Ahmad Khalwani, S.Pd.',
                'kelas' => 'X TO 2',
                'role' => 'guru',
                'password' => Hash::make('19880304 202421 1 014'),
            ],
            [
                'nis' => '19750510 202221 2 006',
                'name' => 'Tun Wahyuni, S.Pd.',
                'kelas' => 'X TO 3',
                'role' => 'guru',
                'password' => Hash::make('19750510 202221 2 006'),
            ],
            [
                'nis' => '19771217 201406 2 002',
                'name' => 'Haning Muhadesi, S.T',
                'kelas' => 'X TJKT 1',
                'role' => 'guru',
                'password' => Hash::make('19771217 201406 2 002'),
            ],
            [
                'nis' => '19760516 200604 2 015',
                'name' => 'Eny Suskandani, S.Pd.',
                'kelas' => 'X TJKT 2',
                'role' => 'guru',
                'password' => Hash::make('19760516 200604 2 015'),
            ],
            [
                'nis' => '19731209 200801 2 005',
                'name' => 'Istiqomah, S.Pd.',
                'kelas' => 'X TJKT 3',
                'role' => 'guru',
                'password' => Hash::make('19731209 200801 2 005'),
            ],
            [
                'nis' => '19820723 202221 2 021',
                'name' => 'Pitri Purwanti, S.Kom.',
                'kelas' => 'X PPLG 1',
                'role' => 'guru',
                'password' => Hash::make('19820723 202221 2 021'),
            ],
            [
                'nis' => 'Anggo Dwi Hartanto',
                'name' => 'Anggo Dwi Hartanto, S.Pd.',
                'kelas' => 'X PPLG 2',
                'role' => 'guru',
                'password' => Hash::make('Anggo Dwi Hartanto'),
            ],
            [
                'nis' => '19880904 202221 2 021',
                'name' => 'Nina Saputri, S.Pd.',
                'kelas' => 'X PPLG 3',
                'role' => 'guru',
                'password' => Hash::make('19880904 202221 2 021'),
            ],
            [
                'nis' => 'Fatma Afifah',
                'name' => 'Fatma Afifah, S.Pd.',
                'kelas' => 'X TE 1',
                'role' => 'guru',
                'password' => Hash::make('Fatma Afifah'),
            ],
            [
                'nis' => '19921212 201902 2 004',
                'name' => 'Desi Umi Nurany, S.Pd.',
                'kelas' => 'X TE 2',
                'role' => 'guru',
                'password' => Hash::make('19921212 201902 2 004'),
            ],
            [
                'nis' => '19780925 201101 2 003',
                'name' => 'Siska Pris Setyanti, S.S.',
                'kelas' => 'X TE 3',
                'role' => 'guru',
                'password' => Hash::make('19780925 201101 2 003'),
            ],
            [
                'nis' => '19761115 201001 2 011',
                'name' => 'Nova Dyah Wulanningtyas, S.Pd.',
                'kelas' => 'X TKI 1',
                'role' => 'guru',
                'password' => Hash::make('19761115 201001 2 011'),
            ],
            [
                'nis' => '19670511 200501 2 005',
                'name' => 'Dra. ST Salis Jazilah',
                'kelas' => 'X TKI 2',
                'role' => 'guru',
                'password' => Hash::make('19670511 200501 2 005'),
            ],
            // END KELAS X
            [
                'nis' => 'Mustofa',
                'name' => 'M. Mustofa, S.Pd.I',
                'kelas' => 'XI TKR 1',
                'password' => Hash::make('Mustofa'),
                'role' => 'guru',

            ],
            [
                'nis' => '19680412 200801 1 010',
                'name' => 'Suroto, S.Pd., M.Pd.',
                'kelas' => 'XI TKR 2',
                'password' => Hash::make('19680412 200801 1 010'),
                'role' => 'guru',

            ],
            [
                'nis' => '19780813 200903 1 005',
                'name' => 'Junaedi, S.T.',
                'kelas' => 'XI TKR 3',
                'password' => Hash::make('19780813 200903 1 005'),
                'role' => 'guru',

            ],
            [
                'nis' => 'Subchan',
                'name' => 'Subchan, S.Fil.',
                'kelas' => 'XI TKJ 1',
                'password' => Hash::make('Subchan'),
                'role' => 'guru',

            ],
            [
                'nis' => '19960421 202221 2 007',
                'name' => 'Putri Kartika Sari, S.Pd.',
                'kelas' => 'XI TKJ 2',
                'password' => Hash::make('19960421 202221 2 007'),
                'role' => 'guru',

            ],
            [
                'nis' => '19921001 202221 2 013',
                'name' => 'Dianing Ratri Oktaviani, S.Pd.',
                'kelas' => 'XI TKJ 3',
                'password' => Hash::make('19921001 202221 2 013'),
                'role' => 'guru',

            ],
            [
                'nis' => '19800517 202221 2 014',
                'name' => 'Supiyarni, S.Pd.',
                'kelas' => 'XI PG 1',
                'password' => Hash::make('19800517 202221 2 014'),
                'role' => 'guru',

            ],
            [
                'nis' => '19740918 200604 1 005',
                'name' => 'Joko Supriyono, S.Pd., M.A.',
                'kelas' => 'XI RPL 1',
                'password' => Hash::make('19740918 200604 1 005'),
                'role' => 'guru',

            ],
            [
                'nis' => '19941102 202421 2 035',
                'name' => 'Nurmayukha, S.Pd.',
                'kelas' => 'XI RPL 2',
                'password' => Hash::make('19941102 202421 2 035'),
                'role' => 'guru',

            ],
            [
                'nis' => '19681005 200312 1 003',
                'name' => 'Misno, S.T., M.Eng.',
                'kelas' => 'XI TEI 1',
                'password' => Hash::make('19681005 200312 1 003'),
                'role' => 'guru',

            ],
            [
                'nis' => '19681122 200501 2 008',
                'name' => 'Sarti, M.Pd.',
                'kelas' => 'XI TEI 2',
                'password' => Hash::make('19681122 200501 2 008'),
                'role' => 'guru',

            ],
            [
                'nis' => '19700509 200801 2 007',
                'name' => 'Tutik Solichati, S.Pd.',
                'kelas' => 'XI TKI 1',
                'password' => Hash::make('19700509 200801 2 007'),
                'role' => 'guru',

            ],
            [
                'nis' => '19880314 201101 2 013',
                'name' => 'Ellysa Purwaningsih, S.Pd',
                'kelas' => 'XI TKI 2',
                'password' => Hash::make('19880314 201101 2 013'),
                'role' => 'guru',

            ],
        ]);

        // 1 19841213 202221 2 011 Wali Kelas X TO-1
        // 2 19880304 202421 1 014 Wali Kelas X TO-2
        // 3 19750510 202221 2 006 Wali Kelas X TO-3
        // 4 19771217 201406 2 002 Wali Kelas X TJKT-1
        // 5 19760516 200604 2 015 Wali Kelas X TJKT-2
        // 6 19731209 200801 2 005 Wali Kelas X TJKT-3
        // 7 19820723 202221 2 021 Wali Kelas X PPLG-1
        // 8 - Wali Kelas X PPLG-2
        // 9 19880904 202221 2 021 Wali Kelas X PPLG-3
        // 10 - Wali Kelas X TE-1
        // 11 19921212 201902 2 004 Wali Kelas X TE-2
        // 12 19780925 201101 2 003 Wali Kelas X TE-3
        // 13 19761115 201001 2 011 Wali Kelas X TKI-1
        // 14 19670511 200501 2 005 Wali Kelas X TKI-2
        // 15 - Wali Kelas XI TKR-1
        // 16 19680412 200801 1 010 Wali Kelas XI TKR-2
        // 17 19780813 200903 1 005 Wali Kelas XI TKR-3
        // 18 - Wali Kelas XI TKJ-1
        // 19 19960421 202221 2 007 Wali Kelas XI TKJ-2
        // 20 19921001 202221 2 013 Wali Kelas XI TKJ-3
        // 21 19800517 202221 2 014 Wali Kelas XI PG-1
        // 22 19740918 200604 1 005 Wali Kelas XI RPL-1
        // 23 19941102 202421 2 035 Wali Kelas XI RPL-2
        // 24 19681005 200312 1 003 Wali Kelas XI TEI-1
        // 25 19681122 200501 2 008 Wali Kelas XI TEI-2
        // 26 19700509 200801 2 007 Wali Kelas XI TKI-1
        // 27 19880314 201101 2 013 Wali Kelas XI TKI-2
        // 28 19790612 202421 1 006 Wali Kelas XII TKR-1
        // 29 19740813 200903 1 001 Wali Kelas XII TKR-2
        // 30 19810118 202321 1 002 Wali Kelas XII TKR-3
        // 31 19771113 201406 2 003 Wali Kelas XII TKJ-1
        // 32 19890302 202221 2 011 Wali Kelas XII TKJ-2
        // 33 19790523 200501 1 008 Wali Kelas XII TKJ-3
        // 34 19651015 200801 2 004 Wali Kelas XII RPL-1 
        // 35 - Wali Kelas XII RPL-2
        // 36 19900506 202321 1 008 Wali Kelas XII RPL-3
        // 37 19770211 200801 1 005 Wali Kelas XII TEI-1
        // 38 19790509 200312 2 006 Wali Kelas XII TEI-2
        // 39 19770807 200801 2 012 Wali Kelas XII TEI-3
        // 40 19751005 200501 1 007 Wali Kelas XII TKI-1
        // 41 19720403 201406 2 003 Wali Kelas XII TKI-2

        // Kendal, 14 Juni 2024
        // Kepala Sekolah,
        // Abdul Malik Nugroho, S.Pd.T.
        // NIP. 19811122 201402 1 001
        // Eko Asiyamto, S.Pd.
        // Sari Nurani Rahayu, S.Sos.
        // Moch Tasykur C N, S.Pd.
        // Cornado Setyo Sakti, S.Pd.
        // Joko Pamuji Rahayu, S.Pd.
        // Sari Rahayu Putriyanti, S.Pd.
        // Tuswuri Handayani, S.Pd., M.Pd.
        // Wulan Nila Sakti, S.Pd.
        // Masrurin, S.Kom
        // Surtiyem, S.Pd.
        // Sarti, M.Pd.
        // Tutik Solichati, S.Pd.
        // Ellysa Purwaningsih, S.Pd.
        // Arif Rachman Soleh, S.Pd.
        // Imam Supriyitno, S.T.
        // Suroto, S.Pd., M.Pd.
        // M. Mustofa, S.Pd.I.
        // Junaedi, S.T.
        // Istiana, S.Pd.
        // Putri Kartika Sari, S.Pd.
        // Arif Darmawan, S.T.
        // Subchan, S.Fil.
        // Dianing Ratri Oktaviani, S.Pd.
        // Supiyarni, S.Pd.
        // Joko Supriyono, S.Pd., M.A.
        // Nurmayukha, S.Pd.
        // Misno, S.T., M.Eng.
        // Desi Umi Nurany, S.Pd.
        // Siska Pris Setyanti, S.S.
        // Nova Dyah Wulanningtyas, S.Pd.
        // Dra. ST Salis Jazilah
        // WALI KELAS
        // Wulan Fitri

    }
}
