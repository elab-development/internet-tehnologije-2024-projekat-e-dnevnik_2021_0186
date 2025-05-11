<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Dashboard profesora</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        h2 { color: #4ba799; }
        .predmet { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #aaa; padding: 5px; text-align: left; }
    </style>
</head>
<body>
    <h2>Dashboard profesora</h2>

    @foreach ($predmeti as $predmet)
        <div class="predmet">
            <h3>{{ $predmet['naziv'] }}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Ime ucenika</th>
                        <th>Ocena</th>
                        <th>Datum</th>
                        <th>Komentar</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($predmet['ucenici'] as $ucenik)
                        <tr>
                            <td>{{ $ucenik['ime'] }}</td>
                            <td>{{ $ucenik['ocena'] ?? 'N/A' }}</td>
                            <td>{{ $ucenik['datum'] ?? 'N/A' }}</td>
                            <td>{{ $ucenik['komentar'] ?? 'N/A' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endforeach
</body>
</html>
