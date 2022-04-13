attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
attribute vec3 aVertexTangent;
attribute vec3 aVertexBitangent;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
uniform int textureType1;

varying vec3 ts_light_pos;
varying vec3 ts_view_pos;
varying vec3 ts_frag_pos;

mat3 transpose(in mat3 inMatrix)
{
    vec3 i0 = inMatrix[0];
    vec3 i1 = inMatrix[1];
    vec3 i2 = inMatrix[2];

    mat3 outMatrix = mat3(
        vec3(i0.x, i1.x, i2.x),
        vec3(i0.y, i1.y, i2.y),
        vec3(i0.z, i1.z, i2.z)
    );

    return outMatrix;
}

void main(void) {
    if (textureType1 == 0){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
        // Apply lighting effect
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
    } else if (textureType1 == 1){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        
        // Send the view position to the fragment shader
        vWorldPosition = (uModelViewMatrix * aVertexPosition).xyz;
        
        // Orient the normals and pass to the fragment shader
        vWorldNormal = mat3(uModelViewMatrix) * aVertexNormal;
    } else {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        ts_frag_pos = vec3(uModelViewMatrix * aVertexPosition);
        
        vec3 t = normalize(mat3(uNormalMatrix) * aVertexTangent);
        vec3 b = normalize(mat3(uNormalMatrix) * aVertexBitangent);
        vec3 n = normalize(mat3(uNormalMatrix) * aVertexNormal);
        mat3 tbn = transpose(mat3(t, b, n));

        vec3 light_pos = vec3(1, 2, 0);
        ts_light_pos = tbn * light_pos;
        ts_view_pos = tbn * vec3(0, 0, 0);
        ts_frag_pos = tbn * ts_frag_pos;

        vTextureCoord = aTextureCoord;
    }
}