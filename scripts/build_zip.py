import os
import zipfile

def create_source_zip():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    output_zip = os.path.join(root_dir, 'public', 'fanlink-ai-source.zip')
    
    # Ensure public dir exists
    os.makedirs(os.path.dirname(output_zip), exist_ok=True)
    
    # Remove existing zip if any
    if os.path.exists(output_zip):
        os.remove(output_zip)
        
    ignored_dirs = {
        'node_modules',
        '.git',
        '.aistudio',
        'dist',
        '.cache',
        '.npm',
        '__pycache__'
    }
    
    ignored_files = {
        'fanlink-ai-source.zip',
        '.DS_Store',
        'bun.lock'
    }

    print(f"Creating source archive: {output_zip}")
    count = 0
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for current_root, dirs, files in os.walk(root_dir):
            # Prune ignored dirs, but allow .github
            dirs[:] = [d for d in dirs if d not in ignored_dirs and (not d.startswith('.') or d == '.github')]
            
            for file in files:
                if file in ignored_files or file.endswith('.zip') or file.endswith('.pyc'):
                    continue
                file_path = os.path.join(current_root, file)
                rel_path = os.path.relpath(file_path, root_dir)
                zipf.write(file_path, rel_path)
                count += 1
                
    file_size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    print(f"Successfully packaged {count} files into {output_zip} ({file_size_mb:.2f} MB)")

if __name__ == '__main__':
    create_source_zip()
