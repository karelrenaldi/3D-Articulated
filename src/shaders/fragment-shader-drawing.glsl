varying lowp vec4 vColor;
varying highp vec3 vLighting;

uniform bool uShading;

void main(void) {
    if (uShading) {
        gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
    } else {
        gl_FragColor = vColor;
    }
}