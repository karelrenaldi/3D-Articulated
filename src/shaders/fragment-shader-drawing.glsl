precision highp float;
// All variables for Environment Mapping
// Passed in from the vertex shader.
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

// The texture
uniform samplerCube uTex;

// The position of the camera
uniform vec3 uWorldCameraPos;
uniform int texType2;

// All variables for Texture Mapping
varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
uniform sampler2D uSampler2D;
uniform bool uShadingB;

// All variables for Bump Mapping
varying vec3 ts_light_pos;
varying vec3 ts_view_pos;
varying vec3 ts_frag_pos;

void main(void) {
    if (texType2 == 0){
        highp vec4 texelColor = texture2D(uSampler2D, vTextureCoord);
        if (uShadingB) {
            gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
        } else {
            gl_FragColor = texelColor;
        }
    } else if (texType2 == 1) {
        vec3 worldNormal = normalize(vWorldNormal);
        vec3 eyeToSurfaceDir = normalize(vWorldPosition - uWorldCameraPos);
        vec3 direction = reflect(eyeToSurfaceDir, worldNormal);
        gl_FragColor = textureCube(uTex, direction);
    } else {
        vec3 light_dir = normalize(ts_light_pos - ts_frag_pos);
        vec3 view_dir = normalize(ts_view_pos - ts_frag_pos);
        vec3 albedo = texture2D(uSampler2D, vTextureCoord).rgb;
        vec3 ambient = 0.3 * albedo;
        vec3 norm = normalize(texture2D(uSampler2D, vTextureCoord).rgb * 2.0 - 1.0);
        float diffuse = max(dot(light_dir, norm), 0.0);
        gl_FragColor = vec4(diffuse * albedo + ambient, 1.0);
    }
}