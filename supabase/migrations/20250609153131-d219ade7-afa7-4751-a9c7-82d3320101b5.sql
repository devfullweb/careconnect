
-- First, let's add the missing columns to the testimonials table to support customer-caregiver relationships
ALTER TABLE public.testimonials 
ADD COLUMN customer_id UUID REFERENCES auth.users(id),
ADD COLUMN caregiver_id UUID REFERENCES profiles(id);

-- Enable RLS on testimonials table
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for testimonials
-- Policy for customers to view their own testimonials
CREATE POLICY "Customers can view their own testimonials" 
  ON public.testimonials 
  FOR SELECT 
  USING (auth.uid() = customer_id);

-- Policy for customers to insert their own testimonials
CREATE POLICY "Customers can create their own testimonials" 
  ON public.testimonials 
  FOR INSERT 
  WITH CHECK (auth.uid() = customer_id);

-- Policy for customers to update their own testimonials
CREATE POLICY "Customers can update their own testimonials" 
  ON public.testimonials 
  FOR UPDATE 
  USING (auth.uid() = customer_id);

-- Policy for customers to delete their own testimonials
CREATE POLICY "Customers can delete their own testimonials" 
  ON public.testimonials 
  FOR DELETE 
  USING (auth.uid() = customer_id);

-- Policy to allow public reading of published testimonials (for displaying on website)
CREATE POLICY "Published testimonials are publicly readable" 
  ON public.testimonials 
  FOR SELECT 
  USING (published = true);
