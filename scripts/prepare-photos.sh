#!/bin/bash
# =============================================================================
# Photo Preparation Script for Save the Date
# =============================================================================
# This script helps prepare your photos for the webpage:
# - Resizes images to web-friendly dimensions
# - Optimizes file size
# - Renames to photo1.jpg, photo2.jpg, etc.
# - Updates index.html to reference the new files
#
# Requirements: ImageMagick (install with: sudo apt install imagemagick)
#
# Usage:
#   ./scripts/prepare-photos.sh image1.jpg image2.jpg image3.jpg ...
#   ./scripts/prepare-photos.sh ~/Pictures/*.jpg
#
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ASSETS_DIR="$PROJECT_DIR/assets/images"
INDEX_FILE="$PROJECT_DIR/index.html"

# Configuration
MAX_WIDTH=800
MAX_HEIGHT=1000
QUALITY=85

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo -e "${BLUE}=========================================${NC}"
    echo -e "${BLUE}  Photo Preparation for Save the Date${NC}"
    echo -e "${BLUE}=========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

check_imagemagick() {
    if ! command -v convert &> /dev/null; then
        print_error "ImageMagick is not installed."
        echo ""
        echo "Install it with:"
        echo "  Ubuntu/Debian: sudo apt install imagemagick"
        echo "  macOS:         brew install imagemagick"
        echo "  Fedora:        sudo dnf install ImageMagick"
        echo ""
        exit 1
    fi
}

show_usage() {
    echo "Usage: $0 [OPTIONS] image1.jpg image2.jpg ..."
    echo ""
    echo "Options:"
    echo "  -w, --width NUM     Max width (default: $MAX_WIDTH)"
    echo "  -h, --height NUM    Max height (default: $MAX_HEIGHT)"
    echo "  -q, --quality NUM   JPEG quality 1-100 (default: $QUALITY)"
    echo "  --no-update         Don't update index.html"
    echo "  --help              Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 photo_a.jpg photo_b.jpg photo_c.jpg"
    echo "  $0 -w 600 -q 90 ~/vacation/*.jpg"
    echo ""
}

# Parse arguments
UPDATE_HTML=true
IMAGES=()

while [[ $# -gt 0 ]]; do
    case $1 in
        -w|--width)
            MAX_WIDTH="$2"
            shift 2
            ;;
        -h|--height)
            MAX_HEIGHT="$2"
            shift 2
            ;;
        -q|--quality)
            QUALITY="$2"
            shift 2
            ;;
        --no-update)
            UPDATE_HTML=false
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        -*)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
        *)
            IMAGES+=("$1")
            shift
            ;;
    esac
done

# Main script
print_header
check_imagemagick

if [ ${#IMAGES[@]} -eq 0 ]; then
    print_error "No images provided."
    echo ""
    show_usage
    exit 1
fi

echo "Settings:"
echo "  Max dimensions: ${MAX_WIDTH}x${MAX_HEIGHT}"
echo "  JPEG quality:   ${QUALITY}"
echo "  Output folder:  $ASSETS_DIR"
echo ""

# Create assets directory if needed
mkdir -p "$ASSETS_DIR"

# Process each image
count=1
processed=()

for img in "${IMAGES[@]}"; do
    if [ ! -f "$img" ]; then
        print_warning "File not found: $img (skipping)"
        continue
    fi

    # Check if it's an image
    mimetype=$(file --mime-type -b "$img")
    if [[ ! "$mimetype" =~ ^image/ ]]; then
        print_warning "Not an image: $img (skipping)"
        continue
    fi

    output_file="$ASSETS_DIR/photo${count}.jpg"

    echo -n "Processing $(basename "$img")... "

    # Resize and optimize
    convert "$img" \
        -resize "${MAX_WIDTH}x${MAX_HEIGHT}>" \
        -quality "$QUALITY" \
        -strip \
        -auto-orient \
        "$output_file"

    # Get file sizes for reporting
    original_size=$(du -h "$img" | cut -f1)
    new_size=$(du -h "$output_file" | cut -f1)
    dimensions=$(identify -format "%wx%h" "$output_file")

    echo -e "${GREEN}done${NC}"
    echo "    → photo${count}.jpg (${dimensions}, ${new_size})"

    processed+=("photo${count}.jpg")
    ((count++))
done

echo ""

if [ ${#processed[@]} -eq 0 ]; then
    print_error "No images were processed."
    exit 1
fi

print_success "Processed ${#processed[@]} photo(s)"

# Update index.html
if [ "$UPDATE_HTML" = true ] && [ -f "$INDEX_FILE" ]; then
    echo ""
    echo "Updating index.html..."

    for i in "${!processed[@]}"; do
        photo_num=$((i + 1))
        # Replace .svg with .jpg for each photo
        sed -i "s|assets/images/photo${photo_num}\.svg|assets/images/photo${photo_num}.jpg|g" "$INDEX_FILE"
    done

    print_success "Updated image references in index.html"
fi

# Clean up old SVG placeholders (optional)
echo ""
read -p "Remove placeholder SVG files? [y/N] " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f "$ASSETS_DIR"/photo*.svg
    print_success "Removed placeholder SVGs"
fi

echo ""
echo -e "${GREEN}All done!${NC} Open index.html in your browser to preview."
echo ""
