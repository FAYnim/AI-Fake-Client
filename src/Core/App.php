<?php
// src/Core/App.php

class App {
    private $geminiApiKey;

    public function __construct() {
        // It's recommended to use a more secure method like environment variables 
        // if your hosting provider supports it.
        $this->geminiApiKey = getenv('GEMINI_API_KEY') ?: 'YOUR_GEMINI_API_KEY_HERE';
    }

    public function run() {
        // Set header to return JSON
        header('Content-Type: application/json');

        // Check if it's a POST request
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['error' => 'Invalid request method.']);
            exit;
        }

        // Get the posted JSON data
        $input = json_decode(file_get_contents('php://input'), true);

        // Validate input
        if (empty($input['nama']) || empty($input['bio']) || empty($input['keahlian']) || empty($input['preferensi'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Semua data harus diisi.']);
            exit;
        }

        if ($this->geminiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            http_response_code(500);
            echo json_encode(['error' => 'API Key untuk AI service belum diatur di server.']);
            exit;
        }

        try {
            // --- LANGKAH 1: Membuat Fake Project ---
            // Note the updated path to the prompts
            $rawPrompt = file_get_contents(__DIR__ . '/../prompts/fakeProjectPrompt.txt');
            if ($rawPrompt === false) throw new Exception("Gagal membaca file prompt project.");

            $projectPrompt = str_replace(
                ['{{USER_NAME}}', '{{USER_BIO}}', '{{USER_SKILLS}}', '{{USER_PREFERENCE}}'],
                [$input['nama'], $input['bio'], $input['keahlian'], $input['preferensi']],
                $rawPrompt
            );

            $projectResult = $this->callGemini($projectPrompt, 'Generate Fake Project');
            if ($projectResult['error']) throw new Exception($projectResult['message']);
            $projectRaw = $projectResult['data'];

            // Extract Title and Description
            $title = 'Unknown Project Title';
            $desc = 'No description provided.';
            if (preg_match('/Project Title:\s*(.+)/i', $projectRaw, $titleMatch)) {
                $title = trim($titleMatch[1]);
            }
            if (preg_match('/Project Description:\s*(.+)/s', $projectRaw, $descMatch)) {
                $desc = trim($descMatch[1]);
            }
            
            $projectBrief = "Project Title: $title\n\nProject Description:\n$desc";

            // --- LANGKAH 2: Membuat Pesan Klien Palsu ---
            $clientPromptTemplate = file_get_contents(__DIR__ . '/../prompts/fakeClientPrompt.txt');
            if ($clientPromptTemplate === false) throw new Exception("Gagal membaca file prompt client.");

            $finalClientPrompt = str_replace(
                ['{{PROJECT_TITLE}}', '{{PROJECT_DESC}}'],
                [$title, $desc],
                $clientPromptTemplate
            );

            $clientResult = $this->callGemini($finalClientPrompt, 'Generate Fake Client Message');
            if ($clientResult['error']) throw new Exception($clientResult['message']);
            $clientMessage = $clientResult['data'];

            // --- Return the final result ---
            echo json_encode([
                'projectBrief' => $projectBrief,
                'clientMessage' => $clientMessage
            ]);

        } catch (Exception $e) {
            http_response_code(500);
            error_log("Server Error: " . $e->getMessage());
            echo json_encode(['error' => 'Terjadi kesalahan di server saat memproses permintaan.']);
        }
    }

    private function callGemini($prompt, $stage = '') {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $this->geminiApiKey;

        $data = [
            'contents' => [['parts' => [['text' => $prompt]]]],
            'generationConfig' => ['temperature' => 0.8, 'topK' => 40, 'topP' => 0.95]
        ];

        $json_data = json_encode($data);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curl_error = curl_error($ch);
        curl_close($ch);

        if ($http_code !== 200) {
            error_log("[$stage] Gemini API Error (HTTP $http_code): $curl_error - Response: $response");
            return ['error' => true, 'message' => "Gagal terhubung ke AI service (Status: $http_code)."];
        }
        
        $result = json_decode($response, true);
        $output = $result['candidates'][0]['content']['parts'][0]['text'] ?? '[No Response from AI]';
        
        return ['error' => false, 'data' => $output];
    }
}
