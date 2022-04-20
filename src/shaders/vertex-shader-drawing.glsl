
attribute vec4 aVPos;
attribute vec3 aVNormal;
attribute vec3 aVTangent;
attribute vec3 aVBitangent;
attribute vec2 aTexCoord;

uniform mat4 uNormalM;
uniform mat4 uModelViewM;
uniform mat4 uProjM;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
uniform int texType1;

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
    if (texType1 == 0){
        gl_Position = uProjM * uModelViewM * aVPos;
        vTextureCoord = aTexCoord;
        // Apply lighting effect
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        highp vec4 transformedNormal = uNormalM * vec4(aVNormal, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
    } else if (texType1 == 1){
        gl_Position = uProjM * uModelViewM * aVPos;
        
        // Send the view position to the fragment shader
        vWorldPosition = (uModelViewM * aVPos).xyz;
        
        // Orient the normals and pass to the fragment shader
        vWorldNormal = mat3(uModelViewM) * aVNormal;
    } else {
        gl_Position = uProjM * uModelViewM * aVPos;
        ts_frag_pos = vec3(uModelViewM * aVPos);
        
        vec3 t = normalize(mat3(uNormalM) * aVTangent);
        vec3 b = normalize(mat3(uNormalM) * aVBitangent);
        vec3 n = normalize(mat3(uNormalM) * aVNormal);
        mat3 tbn = transpose(mat3(t, b, n));

        vec3 light_pos = vec3(1, 2, 0);
        ts_light_pos = tbn * light_pos;
        ts_view_pos = tbn * vec3(0, 0, 0);
        ts_frag_pos = tbn * ts_frag_pos;

        vTextureCoord = aTexCoord;
    }
}
