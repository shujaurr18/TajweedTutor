cmake_minimum_required(VERSION 3.13)
project(tajweed_audio)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_library(log-lib log)
find_library(android-lib android)

# Include directories
include_directories(${CMAKE_CURRENT_SOURCE_DIR})

# Source files
set(SOURCES
    tajweed_audio.cpp
    tajweed_audio.h
)

# Create shared library
add_library(tajweed_audio SHARED ${SOURCES})

# Link libraries
target_link_libraries(tajweed_audio
    ${log-lib}
    ${android-lib}
)

# Compiler flags
target_compile_options(tajweed_audio PRIVATE
    -Wall
    -Wextra
    -O2
    -fPIC
)

# Include React Native headers
target_include_directories(tajweed_audio PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# Optional: Add external audio processing libraries
# Uncomment and configure these when you want to integrate real audio libraries

# find_package(PkgConfig REQUIRED)
# pkg_check_modules(LIBSNDFILE REQUIRED sndfile)

# target_include_directories(tajweed_audio PRIVATE ${LIBSNDFILE_INCLUDE_DIRS})
# target_link_libraries(tajweed_audio ${LIBSNDFILE_LIBRARIES})
# target_compile_options(tajweed_audio PRIVATE ${LIBSNDFILE_CFLAGS_OTHER})

# For FFTW (if you want to use it for better FFT performance)
# find_package(FFTW REQUIRED)
# target_include_directories(tajweed_audio PRIVATE ${FFTW_INCLUDE_DIRS})
# target_link_libraries(tajweed_audio ${FFTW_LIBRARIES})

# For aubio (audio analysis library)
# find_package(aubio REQUIRED)
# target_include_directories(tajweed_audio PRIVATE ${AUBIO_INCLUDE_DIRS})
# target_link_libraries(tajweed_audio ${AUBIO_LIBRARIES})
