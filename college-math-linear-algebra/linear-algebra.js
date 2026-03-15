// College Math Linear Algebra Interactive Tutor. No deps.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'college-math-linear-algebra');
const MASTERY_THRESHOLD = 0.8;

const SKILLS = {
  'systems-matrices': ['row-reduction', 'rref', 'matrix-operations', 'inverse-matrices', 'lu-factorization'],
  'vector-spaces': ['subspace-test', 'span-independence', 'basis-dimension', 'rank-nullity', 'coordinate-systems'],
  'linear-transformations': ['kernel-image', 'matrix-representation', 'change-of-basis', 'isomorphisms'],
  'determinants': ['cofactor-expansion', 'determinant-properties', 'cramers-rule', 'geometric-interpretation'],
  'eigenvalues-eigenvectors': ['characteristic-polynomial', 'diagonalization', 'complex-eigenvalues', 'matrix-powers'],
  'orthogonality': ['gram-schmidt', 'orthogonal-projections', 'least-squares', 'qr-factorization'],
  'svd-applications': ['svd-computation', 'pseudoinverse', 'low-rank-approximation', 'pca-intro'],
};

const PROBLEM_BANKS = {
  'row-reduction': {
    type: 'compute',
    instruction: 'Perform row reduction. Give the solution or describe the solution set.',
    problems: [
      { prompt: 'Solve: x + 2y = 5, 3x + y = 5.', answer: 'x=1, y=2', solution: 'R2 -= 3R1: -5y=-10, y=2, x=1.' },
      { prompt: 'Solve: x + y + z = 6, 2x + 3y + z = 14, x + 2y + 2z = 11.', answer: 'x=1, y=2, z=3', solution: 'Eliminate to get z=3, y=2, x=1.' },
      { prompt: 'Solve: 2x + 4y = 6, x + 2y = 3.', answer: 'x=3-2t, y=t (free)', solution: 'R1=2*R2. Infinite solutions: x=3-2y.' },
      { prompt: 'Solve: x + y = 1, x + y = 2.', answer: 'no solution', solution: 'Inconsistent: 0 = 1 after elimination.' },
      { prompt: 'Solve: x - y + 2z = 5, 2x + y - z = 1, 3x + 2y = 8.', answer: 'x=2, y=1, z=1', solution: 'R2-=2R1: 3y-5z=-9. R3-=3R1: 5y-6z=-7. Solve: z=1, y=1, x=2.' },
    ],
  },
  'rref': {
    type: 'compute',
    instruction: 'Find the reduced row echelon form (RREF).',
    problems: [
      { prompt: 'RREF of [[1,2,3],[4,5,6],[7,8,9]]', answer: '[[1,0,-1],[0,1,2],[0,0,0]]', solution: 'Rank 2. Third row becomes zeros.' },
      { prompt: 'RREF of [[1,0,1],[0,1,1],[1,1,0]]', answer: '[[1,0,1],[0,1,1],[0,0,-2]] -> [[1,0,0],[0,1,0],[0,0,1]]', solution: 'Rank 3. Identity (after scaling).' },
      { prompt: 'RREF of [[2,4],[1,2]]', answer: '[[1,2],[0,0]]', solution: 'Rank 1. R2 -= (1/2)R1.' },
      { prompt: 'RREF of [[1,2,0,3],[0,0,1,2],[2,4,1,8]]', answer: '[[1,2,0,3],[0,0,1,2],[0,0,0,0]]', solution: 'R3-=2R1, then R3-=R2 gives zero row.' },
    ],
  },
  'matrix-operations': {
    type: 'compute',
    instruction: 'Perform the matrix operation.',
    problems: [
      { prompt: 'A=[[1,2],[3,4]], B=[[5,6],[7,8]]. Compute AB.', answer: '[[19,22],[43,50]]', solution: 'AB[1,1]=1*5+2*7=19, etc.' },
      { prompt: 'A=[[1,0],[0,-1]]. Compute A^2.', answer: '[[1,0],[0,1]]', solution: 'A^2 = I. A is a reflection.' },
      { prompt: 'A=[[2,1],[0,3]]. Compute A^T.', answer: '[[2,0],[1,3]]', solution: 'Transpose swaps rows and columns.' },
      { prompt: 'A=[[1,2],[3,4]], B=[[1,0],[0,1]]. Compute A+B.', answer: '[[2,2],[3,5]]', solution: 'Add entry-wise.' },
      { prompt: 'A=[[1,2,3],[4,5,6]]. What is the size of A^T?', answer: '3x2', solution: 'A is 2x3, so A^T is 3x2.' },
    ],
  },
  'inverse-matrices': {
    type: 'compute',
    instruction: 'Find the inverse matrix.',
    problems: [
      { prompt: 'A=[[2,1],[5,3]]. Find A^(-1).', answer: '[[3,-1],[-5,2]]', solution: 'det=6-5=1. A^(-1) = [[3,-1],[-5,2]]/1.' },
      { prompt: 'A=[[1,2],[3,4]]. Find A^(-1).', answer: '[[-2,1],[3/2,-1/2]]', solution: 'det=-2. A^(-1) = (1/-2)[[4,-2],[-3,1]].' },
      { prompt: 'A=[[1,0,0],[0,2,0],[0,0,3]]. Find A^(-1).', answer: '[[1,0,0],[0,1/2,0],[0,0,1/3]]', solution: 'Diagonal: invert each entry.' },
      { prompt: 'A=[[1,1],[1,1]]. Is A invertible?', answer: 'no', solution: 'det=0. Not invertible.' },
    ],
  },
  'lu-factorization': {
    type: 'compute',
    instruction: 'Find the LU factorization.',
    problems: [
      { prompt: 'A=[[2,1],[4,5]]. Find L and U.', answer: 'L=[[1,0],[2,1]], U=[[2,1],[0,3]]', solution: 'R2-=2R1: U=[[2,1],[0,3]]. Multiplier 2 goes in L.' },
      { prompt: 'A=[[1,2],[3,8]]. Find L and U.', answer: 'L=[[1,0],[3,1]], U=[[1,2],[0,2]]', solution: 'R2-=3R1: U=[[1,2],[0,2]]. L has 3 below diagonal.' },
      { prompt: 'A=[[1,1,1],[2,3,1],[3,1,2]]. Find L and U.', answer: 'L=[[1,0,0],[2,1,0],[3,-2,1]], U=[[1,1,1],[0,1,-1],[0,0,-3]]', solution: 'R2-=2R1: [0,1,-1]. R3-=3R1: [0,-2,-1]. R3+=2R2: [0,0,-3].' },
    ],
  },
  'subspace-test': {
    type: 'proof',
    instruction: 'Determine if the set is a subspace. Answer YES or NO with justification.',
    problems: [
      { prompt: 'W = {(x,y) in R^2 : x + y = 0}. Subspace of R^2?', answer: 'yes', solution: 'Contains 0. Closed under addition and scalar mult. (x+y=0, a+b=0 => (x+a)+(y+b)=0).' },
      { prompt: 'W = {(x,y) in R^2 : x + y = 1}. Subspace of R^2?', answer: 'no', solution: 'Does not contain (0,0) since 0+0 != 1.' },
      { prompt: 'W = {(x,y,z) : x = 2z}. Subspace of R^3?', answer: 'yes', solution: 'Contains 0. If x=2z and a=2c, then (x+a)=2(z+c). Closed.' },
      { prompt: 'W = {(x,y) : xy >= 0}. Subspace of R^2?', answer: 'no', solution: '(1,0) and (0,-1) are in W but (1,-1) is not (1*(-1)<0).' },
      { prompt: 'W = set of all 2x2 symmetric matrices. Subspace of M_{2x2}?', answer: 'yes', solution: 'Zero matrix is symmetric. Sum and scalar multiple of symmetric matrices are symmetric.' },
    ],
  },
  'span-independence': {
    type: 'analyze',
    instruction: 'Determine if the vectors are linearly independent.',
    problems: [
      { prompt: 'v1=(1,0,0), v2=(0,1,0), v3=(0,0,1). Independent?', answer: 'yes', solution: 'Standard basis vectors are independent.' },
      { prompt: 'v1=(1,2), v2=(2,4). Independent?', answer: 'no', solution: 'v2 = 2*v1. Linearly dependent.' },
      { prompt: 'v1=(1,1,0), v2=(0,1,1), v3=(1,0,-1). Independent?', answer: 'no', solution: 'v1-v2 = (1,0,-1) = v3. Dependent.' },
      { prompt: 'v1=(1,2,3), v2=(4,5,6). Independent?', answer: 'yes', solution: 'Neither is a scalar multiple of the other.' },
      { prompt: 'v1=(1,0,1), v2=(0,1,0), v3=(1,1,1). Independent?', answer: 'no', solution: 'v3 = v1 + v2.' },
    ],
  },
  'basis-dimension': {
    type: 'compute',
    instruction: 'Find a basis and the dimension.',
    problems: [
      { prompt: 'Find basis and dimension of {(x,y,z) : x+y+z=0}.', answer: 'basis: {(1,-1,0),(0,1,-1)}, dim=2', solution: 'z=-x-y. (x,y,-x-y) = x(1,0,-1)+y(0,1,-1). Dim=2.' },
      { prompt: 'Column space of A=[[1,2],[3,6]]. Basis and dimension.', answer: 'basis: {(1,3)}, dim=1', solution: 'Col 2 = 2*Col 1. Rank=1.' },
      { prompt: 'Null space of A=[[1,2,3],[0,1,1]].', answer: 'basis: {(-1,-1,1)}, dim=1', solution: 'RREF: [[1,0,1],[0,1,1]]. x3 free, x2=-x3, x1=-x3.' },
      { prompt: 'Dimension of the space of 2x2 symmetric matrices.', answer: '3', solution: 'Basis: [[1,0],[0,0]], [[0,1],[1,0]], [[0,0],[0,1]].' },
    ],
  },
  'rank-nullity': {
    type: 'compute',
    instruction: 'Apply the rank-nullity theorem.',
    problems: [
      { prompt: 'A is 3x5 with rank 2. What is nullity(A)?', answer: '3', solution: 'Rank-nullity: 2 + nullity = 5. Nullity = 3.' },
      { prompt: 'A is 4x4 with null space dimension 1. What is rank(A)?', answer: '3', solution: 'Rank = 4 - 1 = 3.' },
      { prompt: 'T: R^6 -> R^4 is linear with dim(ker T) = 2. What is dim(im T)?', answer: '4', solution: 'Rank-nullity: 2 + dim(im T) = 6. dim(im T) = 4.' },
      { prompt: 'A is 3x3 and Ax=0 has only trivial solution. Rank?', answer: '3', solution: 'Nullity=0, rank=3. A is invertible.' },
    ],
  },
  'coordinate-systems': {
    type: 'compute',
    instruction: 'Find the coordinate vector with respect to the given basis.',
    problems: [
      { prompt: 'v=(5,3), basis B={(1,0),(1,1)}. Find [v]_B.', answer: '(2,3)', solution: 'v = 2*(1,0) + 3*(1,1) = (2,3)+(3,3)? No: 2(1,0)+3(1,1)=(2+3,3)=(5,3). So [v]_B=(2,3).' },
      { prompt: 'v=(1,2,3), standard basis. Find [v]_E.', answer: '(1,2,3)', solution: 'Standard basis: coordinates are the components.' },
      { prompt: 'v=(4,1), basis B={(1,1),(1,-1)}. Find [v]_B.', answer: '(5/2, 3/2)', solution: 'a+b=4, a-b=1. a=5/2, b=3/2.' },
    ],
  },
  'kernel-image': {
    type: 'compute',
    instruction: 'Find the kernel and image of the linear transformation.',
    problems: [
      { prompt: 'T(x,y) = (x+y, x-y). Find ker(T).', answer: '{(0,0)}', solution: 'x+y=0 and x-y=0 implies x=y=0. Kernel is trivial.' },
      { prompt: 'T(x,y,z) = (x+z, y). Find ker(T).', answer: '{(-t,0,t) : t in R}', solution: 'x+z=0, y=0. x=-z. Kernel = span{(-1,0,1)}.' },
      { prompt: 'T(x,y) = (x+y, 2x+2y). Find dim(im T).', answer: '1', solution: 'Output always (a,2a). Image = span{(1,2)}. Dim=1.' },
      { prompt: 'A=[[1,2],[0,0]]. Find ker(A) and im(A).', answer: 'ker=span{(-2,1)}, im=span{(1,0)}', solution: 'Ax=0: x=-2y. Im = col space = span{(1,0)}.' },
    ],
  },
  'matrix-representation': {
    type: 'compute',
    instruction: 'Find the matrix of the linear transformation with respect to the standard basis.',
    problems: [
      { prompt: 'T(x,y) = (2x+y, x-3y). Find the matrix.', answer: '[[2,1],[1,-3]]', solution: 'T(e1)=(2,1), T(e2)=(1,-3).' },
      { prompt: 'T(x,y) = (y, x). Find the matrix.', answer: '[[0,1],[1,0]]', solution: 'T(e1)=(0,1), T(e2)=(1,0). Swap matrix.' },
      { prompt: 'T(x,y,z) = (x+z, y-z). Find the matrix.', answer: '[[1,0,1],[0,1,-1]]', solution: 'T(e1)=(1,0), T(e2)=(0,1), T(e3)=(1,-1).' },
      { prompt: 'Rotation by 90 degrees CCW in R^2.', answer: '[[0,-1],[1,0]]', solution: 'T(e1)=(0,1), T(e2)=(-1,0).' },
    ],
  },
  'change-of-basis': {
    type: 'compute',
    instruction: 'Find the change of basis matrix.',
    problems: [
      { prompt: 'From B={(1,1),(1,-1)} to standard basis E.', answer: '[[1,1],[1,-1]]', solution: 'Columns are basis vectors of B in terms of E.' },
      { prompt: 'From E to B={(1,1),(1,-1)}. P_{E->B}.', answer: '[[1/2,1/2],[1/2,-1/2]]', solution: 'Inverse of P_{B->E}.' },
      { prompt: 'B1={(1,0),(0,1)}, B2={(1,1),(0,1)}. Find P_{B1->B2}.', answer: '[[1,-1],[0,1]]', solution: 'Express B1 vectors in B2 coordinates.' },
    ],
  },
  'isomorphisms': {
    type: 'analyze',
    instruction: 'Determine if the transformation is an isomorphism.',
    problems: [
      { prompt: 'T: R^2 -> R^2, T(x,y) = (2x, 3y). Isomorphism?', answer: 'yes', solution: 'Injective (ker=0) and surjective (onto R^2). det=6!=0.' },
      { prompt: 'T: R^2 -> R^2, T(x,y) = (x+y, x+y). Isomorphism?', answer: 'no', solution: 'Not injective: T(1,0)=T(0,1)=(1,1).' },
      { prompt: 'T: R^3 -> R^2, T(x,y,z)=(x,y). Isomorphism?', answer: 'no', solution: 'Different dimensions: R^3 not isomorphic to R^2.' },
    ],
  },
  'cofactor-expansion': {
    type: 'compute',
    instruction: 'Compute the determinant.',
    problems: [
      { prompt: 'det([[3,1],[4,2]])', answer: '2', solution: '3*2 - 1*4 = 2.' },
      { prompt: 'det([[1,2,3],[0,4,5],[0,0,6]])', answer: '24', solution: 'Upper triangular: 1*4*6 = 24.' },
      { prompt: 'det([[2,1,0],[0,3,1],[1,0,2]])', answer: '13', solution: 'Expand along row 1: 2(6-0)-1(0-1)+0(0-3) = 12+1 = 13.' },
      { prompt: 'det([[1,2],[3,4]])', answer: '-2', solution: '1*4 - 2*3 = -2.' },
      { prompt: 'det([[0,1,2],[3,0,1],[2,1,0]])', answer: '8', solution: 'Expand along row 1: 0 - 1(0-2) + 2(3-0) = 0+2+6 = 8.' },
    ],
  },
  'determinant-properties': {
    type: 'analyze',
    instruction: 'Use properties of determinants to answer.',
    problems: [
      { prompt: 'If det(A)=3 and det(B)=4, what is det(AB)?', answer: '12', solution: 'det(AB) = det(A)*det(B) = 12.' },
      { prompt: 'If A is 3x3 and det(A)=2, what is det(3A)?', answer: '54', solution: 'det(cA) = c^n * det(A) = 27*2 = 54.' },
      { prompt: 'If det(A)=5, what is det(A^(-1))?', answer: '1/5', solution: 'det(A^(-1)) = 1/det(A) = 1/5.' },
      { prompt: 'If det(A)=0, is A invertible?', answer: 'no', solution: 'A is invertible iff det(A) != 0.' },
      { prompt: 'If A is 4x4 and det(A)=-2, what is det(A^T)?', answer: '-2', solution: 'det(A^T) = det(A).' },
    ],
  },
  'cramers-rule': {
    type: 'compute',
    instruction: 'Use Cramer\'s rule to solve.',
    problems: [
      { prompt: '2x + y = 5, x - y = 1. Find x using Cramer\'s rule.', answer: '2', solution: 'det(A)=-3. det(A_x)=det([[5,1],[1,-1]])=-6. x=-6/-3=2.' },
      { prompt: 'x + 2y = 4, 3x + y = 7. Find y.', answer: '1', solution: 'det(A)=1-6=-5. det(A_y)=det([[1,4],[3,7]])=7-12=-5. y=-5/-5=1.' },
      { prompt: 'x + y = 3, 2x + 3y = 8. Find x.', answer: '1', solution: 'det(A)=3-2=1. det(A_x)=det([[3,1],[8,3]])=9-8=1. x=1.' },
    ],
  },
  'geometric-interpretation': {
    type: 'analyze',
    instruction: 'Give the geometric interpretation.',
    problems: [
      { prompt: 'A=[[2,0],[0,3]]. What does det(A)=6 mean geometrically?', answer: 'area scaling factor is 6', solution: 'A scales area by |det(A)| = 6.' },
      { prompt: 'det(A) = -1. What does the sign tell us?', answer: 'orientation is reversed', solution: 'Negative determinant means the transformation reverses orientation.' },
      { prompt: 'det(A) = 0. Geometric meaning?', answer: 'collapses dimension (maps to lower-dimensional space)', solution: 'Singular: maps R^n onto a subspace of lower dimension.' },
    ],
  },
  'characteristic-polynomial': {
    type: 'compute',
    instruction: 'Find eigenvalues and eigenvectors.',
    problems: [
      { prompt: 'A=[[2,1],[0,3]]. Find eigenvalues.', answer: '2 and 3', solution: 'Upper triangular: eigenvalues are diagonal entries.' },
      { prompt: 'A=[[4,1],[2,3]]. Find eigenvalues.', answer: '2 and 5', solution: 'det(A-lI)=(4-l)(3-l)-2=l^2-7l+10=(l-2)(l-5). l=2,5.' },
      { prompt: 'A=[[0,-1],[1,0]]. Find eigenvalues.', answer: 'i and -i', solution: 'det(A-lI)=l^2+1=0. l=+/-i.' },
      { prompt: 'A=[[3,0],[0,3]]. Find eigenvalues and eigenvectors.', answer: 'lambda=3, every nonzero vector is an eigenvector', solution: 'A=3I. All vectors are eigenvectors with eigenvalue 3.' },
      { prompt: 'A=[[1,2],[0,1]]. Find eigenvalues.', answer: '1 (repeated)', solution: 'Upper triangular. lambda=1 with multiplicity 2.' },
    ],
  },
  'diagonalization': {
    type: 'compute',
    instruction: 'Diagonalize the matrix or explain why it is not diagonalizable.',
    problems: [
      { prompt: 'A=[[4,1],[2,3]]. Diagonalize A=PDP^(-1).', answer: 'D=[[2,0],[0,5]], P=[[-1,1],[2,1]]', solution: 'Eigenvalues 2,5. Eigenvectors: (-1,2) and (1,1). P columns are eigenvectors.' },
      { prompt: 'A=[[1,1],[0,1]]. Is A diagonalizable?', answer: 'no', solution: 'lambda=1 (mult 2) but eigenspace is 1-dimensional.' },
      { prompt: 'A=[[5,0],[0,3]]. Diagonalize.', answer: 'already diagonal: D=A, P=I', solution: 'Diagonal matrix is already in diagonal form.' },
      { prompt: 'A=[[0,1],[-1,0]]. Diagonalizable over R?', answer: 'no', solution: 'Eigenvalues are +/-i (complex). Not diagonalizable over R.' },
    ],
  },
  'complex-eigenvalues': {
    type: 'compute',
    instruction: 'Find the complex eigenvalues and describe the transformation.',
    problems: [
      { prompt: 'A=[[0,-1],[1,0]]. Eigenvalues and geometric meaning.', answer: 'i and -i; rotation by 90 degrees', solution: 'lambda=+/-i. A rotates by pi/2.' },
      { prompt: 'A=[[1,-2],[1,3]]. Find eigenvalues.', answer: '2+i and 2-i', solution: 'lambda^2-4*lambda+5=0. lambda=(4+/-sqrt(-4))/2=2+/-i.' },
      { prompt: 'A=[[cos(t),-sin(t)],[sin(t),cos(t)]]. Eigenvalues.', answer: 'e^(it) and e^(-it)', solution: 'Rotation matrix. lambda = cos(t)+/-i*sin(t).' },
    ],
  },
  'matrix-powers': {
    type: 'compute',
    instruction: 'Compute the matrix power using diagonalization.',
    problems: [
      { prompt: 'A=[[2,0],[0,3]]. Compute A^5.', answer: '[[32,0],[0,243]]', solution: 'Diagonal: A^5 = [[2^5,0],[0,3^5]].' },
      { prompt: 'If A=PDP^(-1) with D=[[1,0],[0,2]], find A^3 in terms of P.', answer: 'P*[[1,0],[0,8]]*P^(-1)', solution: 'A^3 = P*D^3*P^(-1) = P*[[1,0],[0,8]]*P^(-1).' },
      { prompt: 'A=[[0,1],[1,0]]. Find A^10.', answer: '[[1,0],[0,1]]', solution: 'A^2=I. A^10=(A^2)^5=I.' },
    ],
  },
  'gram-schmidt': {
    type: 'compute',
    instruction: 'Apply the Gram-Schmidt process.',
    problems: [
      { prompt: 'Orthogonalize {(1,1,0), (1,0,1)}.', answer: '{(1,1,0), (1/2,-1/2,1)}', solution: 'u1=(1,1,0). proj=(1,1,0).(1,0,1)/2 = 1/2. u2=(1,0,1)-1/2*(1,1,0)=(1/2,-1/2,1).' },
      { prompt: 'Orthogonalize {(1,0), (1,1)}.', answer: '{(1,0), (0,1)}', solution: 'u1=(1,0). proj=1. u2=(1,1)-1*(1,0)=(0,1).' },
      { prompt: 'Orthogonalize {(1,1,1), (0,1,1), (0,0,1)}.', answer: '{(1,1,1), (-2/3,1/3,1/3), (0,-1/2,1/2)}', solution: 'Standard Gram-Schmidt on the three vectors.' },
    ],
  },
  'orthogonal-projections': {
    type: 'compute',
    instruction: 'Find the orthogonal projection.',
    problems: [
      { prompt: 'Project (3,4) onto (1,0).', answer: '(3,0)', solution: 'proj = ((3,4).(1,0)/|(1,0)|^2)*(1,0) = 3*(1,0) = (3,0).' },
      { prompt: 'Project (1,2,3) onto (1,1,1).', answer: '(2,2,2)', solution: 'proj = (6/3)*(1,1,1) = (2,2,2).' },
      { prompt: 'Project (1,2) onto the line y=x.', answer: '(3/2, 3/2)', solution: 'Direction (1,1). proj = (3/2)*(1,1) = (3/2,3/2).' },
      { prompt: 'Distance from (1,2,3) to the plane spanned by (1,0,0) and (0,1,0).', answer: '3', solution: 'Projection onto plane is (1,2,0). Distance = |3| = 3.' },
    ],
  },
  'least-squares': {
    type: 'compute',
    instruction: 'Find the least squares solution.',
    problems: [
      { prompt: 'A=[[1,1],[1,2],[1,3]], b=(1,2,4). Find the least squares solution.', answer: 'x = (-2/3, 3/2)', solution: 'A^T A=[[3,6],[6,14]], A^T b=[7,17]. Solve: a=-2/3, b=3/2.' },
      { prompt: 'Fit y=a+bx to points (1,1),(2,3),(3,4).', answer: 'a=-2/3, b=3/2', solution: 'Same as least squares with A=[[1,1],[1,2],[1,3]]. a=-2/3, b=3/2.' },
      { prompt: 'A=[[1],[1],[1]], b=(2,3,4). Least squares solution.', answer: 'x=3', solution: 'A^T A = 3, A^T b = 9. x = 3 (the mean).' },
    ],
  },
  'qr-factorization': {
    type: 'compute',
    instruction: 'Find the QR factorization.',
    problems: [
      { prompt: 'A=[[1,1],[0,1]]. Find Q and R.', answer: 'Q=[[1,0],[0,1]], R=[[1,1],[0,1]]', solution: 'Columns already orthogonal after Gram-Schmidt (col 1 is (1,0) normalized, col 2 proj gives (0,1)).' },
      { prompt: 'A=[[1,1],[1,0]]. Find Q and R.', answer: 'Q=[[1/sqrt(2),1/sqrt(2)],[1/sqrt(2),-1/sqrt(2)]], R=[[sqrt(2),1/sqrt(2)],[0,1/sqrt(2)]]', solution: 'Gram-Schmidt then normalize.' },
    ],
  },
  'svd-computation': {
    type: 'compute',
    instruction: 'Find the singular value decomposition.',
    problems: [
      { prompt: 'A=[[3,0],[0,2]]. Find the SVD.', answer: 'U=I, Sigma=[[3,0],[0,2]], V=I', solution: 'Diagonal matrix: singular values are 3 and 2.' },
      { prompt: 'A=[[1,0],[0,0]]. Singular values?', answer: '1 and 0', solution: 'A^T A = [[1,0],[0,0]]. Eigenvalues 1,0. Singular values: 1,0.' },
      { prompt: 'If A has singular values 5,3,1, what is the rank?', answer: '3', solution: 'Number of nonzero singular values = rank.' },
    ],
  },
  'pseudoinverse': {
    type: 'compute',
    instruction: 'Find or apply the pseudoinverse.',
    problems: [
      { prompt: 'A=[[1,0],[0,0]]. Find A^+.', answer: '[[1,0],[0,0]]', solution: 'A^+ inverts the nonzero singular value. Same matrix here.' },
      { prompt: 'For least squares, what does x = A^+ b compute?', answer: 'the minimum-norm least squares solution', solution: 'A^+ b gives the least squares solution with smallest norm.' },
    ],
  },
  'low-rank-approximation': {
    type: 'analyze',
    instruction: 'Answer the question about low-rank approximation.',
    problems: [
      { prompt: 'A has singular values 10,3,0.1. What is the best rank-1 approximation error (Frobenius)?', answer: 'sqrt(9+0.01)=sqrt(9.01)', solution: 'Error = sqrt(sigma_2^2 + sigma_3^2) = sqrt(9.01).' },
      { prompt: 'Why is SVD useful for image compression?', answer: 'low-rank approximation captures most information with fewer values', solution: 'Keep top k singular values. Stores O(k(m+n)) instead of O(mn).' },
    ],
  },
  'pca-intro': {
    type: 'analyze',
    instruction: 'Answer the question about PCA.',
    problems: [
      { prompt: 'What is the first principal component geometrically?', answer: 'direction of maximum variance in the data', solution: 'First PC = eigenvector of covariance matrix with largest eigenvalue.' },
      { prompt: 'How does PCA relate to SVD?', answer: 'principal components are right singular vectors of the centered data matrix', solution: 'If X is centered data, PCA directions are columns of V in X=USV^T.' },
    ],
  },
};

// File I/O

function ensureDataDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }

function profilePath(id) { return path.join(DATA_DIR, String(id).replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }

function loadProfile(id) {
  const fp = profilePath(id);
  if (fs.existsSync(fp)) {
    try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
    catch { fs.renameSync(fp, fp + '.corrupt.' + Date.now()); }
  }
  return { studentId: id, createdAt: new Date().toISOString(), assessments: [], skills: {} };
}

function saveProfile(p) { ensureDataDir(); fs.writeFileSync(profilePath(p.studentId), JSON.stringify(p, null, 2), 'utf8'); }

function calcMastery(attempts) {
  if (!attempts || !attempts.length) return 0;
  const recent = attempts.slice(-5).filter(a => a.total > 0);
  return recent.length ? Math.round(recent.reduce((s, a) => s + a.score / a.total, 0) / recent.length * 100) / 100 : 0;
}

function masteryLabel(r) { return r >= 0.9 ? 'mastered' : r >= MASTERY_THRESHOLD ? 'proficient' : r >= 0.6 ? 'developing' : r > 0 ? 'emerging' : 'not-started'; }

function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function pick(arr, n) { return shuffle(arr).slice(0, Math.min(n, arr.length)); }

function norm(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' '); }

function generateExercise(skill, count = 5) {
  const bank = PROBLEM_BANKS[skill];
  if (!bank) return { error: `No problem bank for ${skill}` };
  const items = pick(bank.problems, count);
  return { type: bank.type, skill, count: items.length, instruction: bank.instruction, items };
}

function checkAnswer(type, expected, answer) {
  const ne = norm(expected), na = norm(answer);
  if (ne === na) return true;
  if (ne.replace(/[*\s]/g, '') === na.replace(/[*\s]/g, '')) return true;
  return false;
}

class LinearAlgebra {
  getProfile(id) { const p = loadProfile(id); return { studentId: p.studentId, createdAt: p.createdAt, totalAssessments: p.assessments.length }; }

  recordAssessment(id, category, skill, score, total, notes = '') {
    if (!SKILLS[category]) throw new Error(`Unknown category: ${category}`);
    if (!SKILLS[category].includes(skill)) throw new Error(`Unknown skill '${skill}' in ${category}`);
    if (typeof total !== 'number' || total <= 0) throw new Error('total must be positive');
    if (typeof score !== 'number' || score < 0 || score > total) throw new Error(`score must be 0-${total}`);
    const p = loadProfile(id);
    const entry = { date: new Date().toISOString(), category, skill, score, total, notes };
    p.assessments.push(entry);
    const key = `${category}/${skill}`;
    if (!p.skills[key]) p.skills[key] = { attempts: [] };
    p.skills[key].attempts.push({ date: entry.date, score, total });
    p.skills[key].mastery = calcMastery(p.skills[key].attempts);
    p.skills[key].label = masteryLabel(p.skills[key].mastery);
    saveProfile(p);
    return { studentId: id, skill: key, score: `${score}/${total}`, mastery: p.skills[key].mastery, label: p.skills[key].label };
  }

  getProgress(id) {
    const p = loadProfile(id);
    const results = {};
    let mastered = 0, total = 0;
    for (const [cat, skills] of Object.entries(SKILLS)) {
      results[cat] = {};
      for (const sk of skills) {
        total++;
        const d = p.skills[`${cat}/${sk}`];
        results[cat][sk] = d ? { mastery: d.mastery, label: d.label } : { mastery: 0, label: 'not-started' };
        if (d && d.mastery >= MASTERY_THRESHOLD) mastered++;
      }
    }
    return { studentId: id, mastered, total, overallPct: total > 0 ? Math.round(mastered / total * 100) : 0, skills: results };
  }

  getNextSkills(id, count = 5) {
    const p = loadProfile(id);
    const candidates = [];
    for (const [cat, skills] of Object.entries(SKILLS)) {
      for (const sk of skills) {
        const d = p.skills[`${cat}/${sk}`];
        const m = d ? d.mastery : 0;
        if (m < MASTERY_THRESHOLD) candidates.push({ category: cat, skill: sk, mastery: m, label: d ? d.label : 'not-started' });
      }
    }
    const order = { developing: 0, emerging: 1, 'not-started': 2 };
    candidates.sort((a, b) => (order[a.label] ?? 3) - (order[b.label] ?? 3) || b.mastery - a.mastery);
    return { studentId: id, next: candidates.slice(0, count) };
  }

  getReport(id) { const p = loadProfile(id); return { studentId: id, progress: this.getProgress(id), recentAssessments: p.assessments.slice(-20).reverse() }; }

  listStudents() { ensureDataDir(); const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')); return { count: files.length, students: files.map(f => f.replace(/\.json$/, '')) }; }

  getSkillCatalog() {
    let total = 0;
    const catalog = {};
    for (const [cat, skills] of Object.entries(SKILLS)) { total += skills.length; catalog[cat] = [...skills]; }
    return { skills: catalog, totalSkills: total };
  }

  generateExercise(skill, count = 5) { return generateExercise(skill, count); }

  checkAnswer(type, expected, answer) { return { correct: checkAnswer(type, expected, answer), expected, studentAnswer: answer }; }

  generateLesson(id) {
    const target = this.getNextSkills(id, 3).next[0];
    if (!target) return { message: 'All skills proficient!' };
    const exercise = generateExercise(target.skill, 5);
    return { studentId: id, targetSkill: target, exercise, lessonPlan: { review: 'Review prerequisites (2-3 min)', teach: `Introduce: ${target.category} > ${target.skill}`, practice: `Complete ${exercise.count || 0} problems` } };
  }
}

module.exports = LinearAlgebra;

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const api = new LinearAlgebra();
  const out = d => console.log(JSON.stringify(d, null, 2));
  try {
    switch (cmd) {
      case 'start': { const [, id] = args; if (!id) throw new Error('Usage: start <id>'); out({ action: 'start', profile: api.getProfile(id), nextSkills: api.getNextSkills(id) }); break; }
      case 'lesson': { const [, id] = args; if (!id) throw new Error('Usage: lesson <id>'); out(api.generateLesson(id)); break; }
      case 'exercise': { const [, id, skill] = args; if (!id) throw new Error('Usage: exercise <id> [skill]'); if (skill) { out(api.generateExercise(skill, 5)); } else { const n = api.getNextSkills(id, 1).next; out(n.length ? api.generateExercise(n[0].skill, 5) : { message: 'All skills proficient!' }); } break; }
      case 'check': { const [, , type, expected, answer] = args; if (!type || expected === undefined || answer === undefined) throw new Error('Usage: check <id> <type> <expected> <answer>'); out(api.checkAnswer(type, expected, answer)); break; }
      case 'record': { const [, id, cat, skill, sc, tot, ...notes] = args; if (!id || !cat || !skill || !sc || !tot) throw new Error('Usage: record <id> <cat> <skill> <score> <total>'); out(api.recordAssessment(id, cat, skill, Number(sc), Number(tot), notes.join(' '))); break; }
      case 'progress': { const [, id] = args; if (!id) throw new Error('Usage: progress <id>'); out(api.getProgress(id)); break; }
      case 'report': { const [, id] = args; if (!id) throw new Error('Usage: report <id>'); out(api.getReport(id)); break; }
      case 'next': { const [, id, n] = args; if (!id) throw new Error('Usage: next <id> [count]'); out(api.getNextSkills(id, n ? Number(n) : 5)); break; }
      case 'catalog': { out(api.getSkillCatalog()); break; }
      case 'students': { out(api.listStudents()); break; }
      default: out({ usage: 'node linear-algebra.js <command> [args]', commands: ['start','lesson','exercise','check','record','progress','report','next','catalog','students'] });
    }
  } catch (err) { out({ error: err.message }); process.exit(1); }
}
