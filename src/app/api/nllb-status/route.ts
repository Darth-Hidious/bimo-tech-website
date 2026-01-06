import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const modelPath = path.join(process.cwd(), 'nllb-200-distilled-600M-int8');
    const exists = fs.existsSync(modelPath);

    // Check if directory is not empty if it exists
    let isValid = false;
    let size = '0 MB';

    if (exists) {
        try {
            const files = fs.readdirSync(modelPath);
            if (files.length > 0) {
                isValid = true;
                // Calculate approximate size
                let totalSize = 0;
                files.forEach(file => {
                    const stats = fs.statSync(path.join(modelPath, file));
                    totalSize += stats.size;
                });
                size = (totalSize / (1024 * 1024)).toFixed(2) + ' MB';
            }
        } catch (e) {
            isValid = false;
        }
    }

    return NextResponse.json({
        installed: exists && isValid,
        path: modelPath,
        size: size,
        files: exists && isValid ? fs.readdirSync(modelPath) : []
    });
}
